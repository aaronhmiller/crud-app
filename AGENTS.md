# crud-app

A small Express 4 service in `app/` that exposes a REST API over a `users`
table in Postgres: list, get, create, update and delete. It exists as a
teaching example of RESTful API design and as a target for code review
tooling. The repo also carries the Docker, Compose, Kubernetes and CI files
that run it.

## Layout

```
app/app.js          the server: Express setup, routes, HTTP on 3000 and HTTPS on 3443
app/apis.js         the five route handlers and the pg Pool
app/terminate.js    graceful shutdown helper
app/init.sql        schema and seed rows, loaded by Postgres on first start
app/test/           unit tests (node:test), one file per area: <area>.test.js
app/package.json    dependencies (express, pg) and the `standard` lint
app/Dockerfile*     container builds (Alpine and Chainguard variants)
docker-compose*.yaml, *-deployment.yaml, *-service.yaml   how it runs
.github/workflows/  CI: compose up, smoke test over HTTP and HTTPS, security scan
factory/            the software factory (see below)
.claude/            the factory's skill and agents
```

## Fresh checkout

```bash
cd app && npm ci
```

Node 20 or later. Nothing else to install for the checks below. Running the
service itself needs Postgres (see Dev server).

## Dev server

The service reads no port or database settings from the environment: it
listens on 3000 and 3443 and connects to Postgres at host `postgres`,
database `api`, user `cg`. The supported way to run it is the whole stack:

```bash
docker compose up -d        # Postgres plus the app, on http://localhost/ and https://localhost/
http :/users                # or curl http://localhost/users
docker compose down
```

When Docker is not available, review by reading the code and exercising
handlers in unit tests. A `Port:` given to a reviewer cannot be applied to
this app; say so under Notes rather than starting a server.

## Validation

These are the checks `factory/checks.sh` runs. Run them from the repo root.

```bash
(cd app && npx standard && node --test)
bash factory/checks.sh
```

The CI workflow additionally brings the stack up with Compose and smoke-tests
`/users/1` over HTTP and `/users/2` over HTTPS. The gate does not run that.

## Conventions

- Style is `standard`: two spaces, no semicolons, single quotes, CommonJS
  `require`. `npx standard --fix` in `app/` cleans most of it up.
- Every SQL statement goes through `pool.query` with `$1`-style parameters.
  Never build SQL from strings.
- Handlers are `(req, res)` functions exported from `app/apis.js` and wired
  in `app/app.js`. New endpoints follow that pattern and keep the status
  codes the existing handlers use: 200, 201, 400, 404.
- Validate request input before it reaches a query: ids are integers, names
  and emails fit the `VARCHAR(30)` columns, and bad input gets a 400 with a
  short message. Anything echoed back to the client goes through
  `escape-html` or `res.json`.
- Tests go in `app/test/<area>.test.js` using `node:test` and `node:assert`.
  Handlers are tested with stub `req`/`res` objects; nothing in the gate may
  need a database or the network. Behaviour that needs Postgres is covered by
  the Compose smoke test in CI.
- Dependencies are `express` and `pg` at runtime and `standard` for lint.
  Adding one is a decision for a human, not a build.
- Schema changes go in `app/init.sql` and must keep the seed rows that CI
  checks for (`Marcia` is id 1, `Amy` is id 2).
- One-line commit messages in the style of `git log --oneline`.

## Scope

This project is a small CRUD API over one table. Changes that belong here
add or tighten an endpoint, validation, an error response, a test, or a doc.
Authentication, multi-tenancy, new tables, new services, or changes to how
it is built, deployed or scanned do not belong in a factory job; they need a
human to decide.

## Security hot spots

- `app/apis.js` is the whole attack surface: every handler takes untrusted
  input from the path or body and hands it to Postgres. Any query that is
  not parameterised, any input that reaches a query without validation, and
  any `throw error` inside a query callback (which crashes the process) is a
  finding.
- Database credentials are hard-coded in `app/apis.js` and
  `docker-compose.yaml`. Moving them is a human decision; copying them
  anywhere new, or logging them, is a finding.
- `app/app.js` reads `KEY` and `CERT` from the environment for TLS. Nothing
  may print, write or send them.
- Error responses must not include stack traces, SQL text or internal paths.
- `.github/`, `.harness/`, `app/Dockerfile*`, Compose and Kubernetes files
  define how the service is built, deployed and scanned. A job that changes
  them is a finding whatever the spec says.
- No new dependencies, scripts that run on install, or network calls other
  than to Postgres.

## Styling

There is no user interface. The `ui` surface does not apply to this project;
the API's "style" is its response shapes and status codes, which live in the
Conventions above.

## Who uses this

Developers calling the API from `curl` or `httpie` while learning REST
design, and automated reviewers reading the code. They expect predictable
JSON, honest status codes, and error messages that say what to fix.

## Software factory

`/factory run` builds every open GitHub issue labeled `factory` through
intake → spec → build → gate → review → approve, one PR per issue. State is in
`factory/jobs/` (gitignored); `factory/bin/job` is its only writer. Checks:
`factory/checks.sh`. Dashboard: `cd factory && python3 -m http.server`, then
open http://localhost:8000/dashboard.html.

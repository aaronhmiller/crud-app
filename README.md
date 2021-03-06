[![Node.js CI](https://github.com/aaronhmiller/crud-app/actions/workflows/main.yaml/badge.svg)](https://github.com/aaronhmiller/crud-app/actions/workflows/main.yaml) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# crud-app
Basic Express app w/ a DB and set of APIs to do CRUD operations with.

h/t to this [tutorial](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/)

### Quickstart

`docker compose up -d`

`http :3000/users`

`http post :3000/users name=Mary email=mary@example.com`

### Using TLS

To illustrate usage of certificates and keys (though for simplicity they are self-signed), run:

`https :3443/users --verify no`

### Building the Express app

`cd app`

`./self-signed.sh` to generate the cert and key referenced in the app.js file

`docker buildx create --use`

```
docker buildx build --platform linux/amd64,linux/arm64 \
 -t <your_docker_hub_account>/crud-app --push .
```

### Using standard to enforce style guidelines

`npm i pg express standard`

`npm test` to see guidance from standard package

`npx standard --fix` to apply the rules from standard in an automated way 

Alternatively, you can run `npm run fix` which has been added to the package.json

### Visualizing the codebase

![Visualization of the codebase](./diagram.svg)

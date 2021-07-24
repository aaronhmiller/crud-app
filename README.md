# crud-app
Basic Express app w/ a DB and set of APIs to do CRUD operations with.

h/t to this [tutorial](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/)

### Laying down the DB schema

```
# psql -U salt
psql (13.3 (Debian 13.3-1.pgdg100+1))
Type "help" for help.

salt=# CREATE DATABASE api;
CREATE DATABASE
salt=# \c api
You are now connected to database "api" as user "salt".
api=# CREATE TABLE users (
ID SERIAL PRIMARY KEY,
name VARCHAR(30),
email VARCHAR(30)
);
CREATE TABLE
api=# INSERT INTO users (name, email)
VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');
INSERT 0 2
api=# select * from users;
 id |  name  |       email
----+--------+--------------------
  1 | Jerry  | jerry@example.com
  2 | George | george@example.com
(2 rows)

api=# \q
```


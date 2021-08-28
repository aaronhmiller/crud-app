const express = require('express')
const bodyParser = require('body-parser')
const os = require('os')
const app = express()
const port = 3000
const api = require('./apis')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres on ' + `${os.arch}` })
})

app.get('/users', api.getUsers)
app.get('/users/:id', api.getUserById)
app.post('/users', api.createUser)
app.put('/users/:id', api.updateUser)
app.delete('/users/:id', api.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port} on ${os.arch}.`)
})

/* API doc
GET    /users     | getUsers()
GET    /users/:id | getUserById()
POST   /users     | createUser()
PUT    /users/:id | updateUser()
DELETE /users/:id | deleteUser()
*/

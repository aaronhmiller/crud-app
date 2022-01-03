const https = require('https');
const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const os = require('os')
const app = express()
const port = 3000
const secPort = 3443
const api = require('./apis')

const options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres running in ' + `${os.platform}` + ' on ' + `${os.arch}` })
})

app.get('/users', api.getUsers)
app.get('/users/:id', api.getUserById)
app.post('/users', api.createUser)
app.put('/users/:id', api.updateUser)
app.delete('/users/:id', api.deleteUser)


httpServer.listen(port, () => {
  console.log(`App running in ${os.platform} on port ${port} on ${os.arch}.`)
})
httpsServer.listen(secPort, () => {
  console.log(`App running in ${os.platform} on port ${secPort} on ${os.arch}.`)
})

/* API doc
GET    /users     | getUsers()
GET    /users/:id | getUserById()
POST   /users     | createUser()
PUT    /users/:id | updateUser()
DELETE /users/:id | deleteUser()
*/

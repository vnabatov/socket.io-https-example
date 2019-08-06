const fs = require('fs')
const https = require('https')
const express = require('express')
const path = require('path')
const app = express()

const serverPort = 443

const server = https.createServer({
  key: fs.readFileSync('certs/file.pem'),
  cert: fs.readFileSync('certs/file.crt'),
  ca: fs.readFileSync('certs/file.crt'),
  requestCert: false,
  rejectUnauthorized: false
}, app)

const io = require('socket.io')(server)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static('public'))

io.on('connection', (socket) => {
  socket.emit('message', 'connect')
  setTimeout(() => {
    socket.emit('message', 'message after 1 sec')
  }, 1000)
})

server.listen(serverPort, () => {
  console.log('server up and running at %s port', serverPort)
})

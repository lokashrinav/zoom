const express = require('express')
const app = express()
const http = require('http');
const server = new http.Server(app);
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const path = require('path')

app.use(express.static(path.join(__dirname, '../client')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../view'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  })
  
  app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })
  
  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })
    })
  })
  
  server.listen(3000)
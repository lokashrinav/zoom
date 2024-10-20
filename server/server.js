const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const v4 = require('uuid')

app.use(express.static("../client"))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
  const id = v4()
  res.redirect(`/${id}`);
})

app.get("/:room", (req, res) => {
    res.render("room", {roomId: req.params.room})
})

io.on("connection", (socket) => {
    socket.on("join-room", (id, user) => {
        socket.join(id);
        socket.to(id).broadcast.emit("connect", user);

        socket.on("disconnect", () => {
            socket.to(id).broadcast.emit("disconnect", user);
        })
    }) 
})
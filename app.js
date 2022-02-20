const path = require("path");
const express = require("express");
const app = express();
const formatMessage = require("./utils/messages");
const http = require("http");
const server = http.createServer(app);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const socketServer = require("socket.io");
const { format } = require("path");
const botName = "ChatCord Bot";
const io = socketServer(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a Client connects
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has Joined!`)); // it will send the event to everyone except the origin
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg)); // emit to everybody
  });

  // Broadcast when a client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }
  });
});
// set the static foldres such as html and css
app.use(express.static(path.join(__dirname, "public")));
server.listen(3000, () => console.log("listening to port 3000"));

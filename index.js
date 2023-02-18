const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const clients = {};

const io = new Server(server);
const port = 3000;

app.use(express.static("public"));

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log(`Connection`);
  clients[socket.id] = { id: socket.id };

  // INCOMING NAME - Name of the input from the user
  socket.on("name", (incomingName) => {
    if (incomingName) {
      clients[socket.id].name = incomingName;
      socket.emit("name", incomingName);
      return;
    }
    socket.emit("name-error", "write your name");
  });

  // SOCKET MESSAGE
  socket.on("message", (message) => {
    console.log("message", message);
    if (message && clients[socket.id] && message && clients[socket.id].name) {
      io.sockets.emit(`message`, clients[socket.id], message);
    }
  });

  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
});

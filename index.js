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

  socket.on("name", (name) => {
    console.log("name", name);
    // TODO: name validation
    clients[socket.id].name = name;
    // send the name back as a confirmation
    socket.emit("name", name);
  });


  socket.on("message", (message) => {
    if (!clients[socket.id].name) {
      // no name? no forward!
      return;
    }
    console.log("message", message);
    io.sockets.emit(`message`, clients[socket.id], message);
  });

  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
});
export default function socketController(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (data, room) => {
      if (!room) {
        // socket.emit("message", data); // this will send the message to all the users including the sender
        socket.broadcast.emit("message", data);
      } else {
        console.log("room", room);
        socket.to(room).emit("message", data);
      }
    });

    // users can join as many rooms as they want
    socket.on("join", (room, cb) => {
      socket.join(room);
      cb(`Joined ${room}`);
    });

    // movement
    socket.on("move", (data) => {
      socket.broadcast.emit("movement", data);
    });
  });
}

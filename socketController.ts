import { Server } from "socket.io";

export default function socketController(io: Server) {
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
    socket.on("join", async (room, cb) => {
      socket.join(room);
      const players = await socket.in(room).fetchSockets();
      console.log(
        "players",
        players.map((player) => player.id)
      );
      console.log(socket.id);
      socket.to(room).emit("join", socket.id);
      cb(JSON.stringify(players.map((player) => player.id)));
    });

    // movement
    socket.on("move", (data) => {
      socket.broadcast.emit("movement", data);
    });
  });
}

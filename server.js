import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      methods: ["GET", "POST"],
    },
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });

  const userIo = io.of("/user");
  userIo.on("connection", (socket) => {
    console.log(`User connected with username -> ${socket.username}`);
  });

  userIo.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      socket.username = getUsernameFromToken(token);
      next();
    } else {
      next(new Error("unauthorized, token not provided"));
    }
  });

  function getUsernameFromToken(token) {
    return `Username ${token}`;
  }

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
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

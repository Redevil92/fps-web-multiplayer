import { createServer } from "node:http";
import socketController from "./socketController";
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

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
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
    console.log(`User connected with username -> ${(socket as any).username}`);
  });

  userIo.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      (socket as any).username = getUsernameFromToken(token);
      next();
    } else {
      next(new Error("unauthorized, token not provided"));
    }
  });

  function getUsernameFromToken(token: string) {
    return `Username ${token}`;
  }

  socketController(io);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

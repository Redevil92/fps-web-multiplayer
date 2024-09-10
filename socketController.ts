import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  MessagePayload,
  ServerToClientEvents,
  SocketData,
} from "./socketInterfaces";

export default function socketController(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  io.on("connection", (socket) => {
    console.log("a user connected --->", socket.id);

    socket.on("connect", () => {
      console.log("a user disconnected --->", socket.id);
    });

    socket.on("message", (data, room) => {
      const payload: MessagePayload = {
        message: data.message,
        room,
        user: socket.id,
      };

      if (!room) {
        // socket.emit("message", data); // this will send the message to all the users including the sender
        socket.broadcast.emit("message", payload);
      } else {
        socket.to(room).emit("message", payload);
      }
    });

    // join a room
    socket.on("join", async (room, cb) => {
      socket.join(room);
      const players = await socket.in(room).fetchSockets();

      socket.to(room).emit("join", { user: socket.id, room });
      cb(players.map((player) => player.id));
    });

    // join a room
    socket.on("exitRoom", async (room, cb) => {
      socket.leave(room);
      const players = await socket.in(room).fetchSockets();
      console.log("EXITING ROOM FOR", socket.id);

      socket.broadcast.to(room).emit("exitRoom", socket.id);
      socket.emit("exitRoom", socket.id);

      cb(players.map((player) => player.id));
    });

    // get available rooms
    socket.on("getRooms", (cb) => {
      const rooms = io.of("/").adapter.rooms;
      // filter rooms eleminiating the one that has the same name as the user
      const filteredRooms: string[] = Array.from(rooms.entries())
        .filter((roomSet: [string, Set<string>]) => {
          const [roomName, roomOwner] = roomSet;
          return !roomOwner.has(roomName);
        })
        .map((room: [string, Set<string>]) => room[0]);
      cb(filteredRooms);
    });

    //get players in the room
    socket.on("getPlayers", (room, cb) => {
      const users = io.sockets.adapter.rooms.get(room);
      cb(Array.from(users ?? []));
    });

    // movement
    socket.on("move", (room, data) => {
      socket.broadcast.to(room).emit("move", data);
    });
  });
}

import { Server } from "socket.io";

export default function socketController(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected --->", socket.id);

    socket.on("connect", () => {
      console.log("a user disconnected --->", socket.id);
    });

    socket.on(SocketEvents.MESSAGE, (data, room) => {
      const payload: MessagePayload = {
        message: data.message,
        room,
        user: socket.id,
      };
      console.log("SOCK MESS", room);
      if (!room) {
        // socket.emit("message", data); // this will send the message to all the users including the sender
        socket.broadcast.emit("message", payload);
      } else {
        socket.to(room).emit("message", payload);
      }
    });

    // join a room
    socket.on(SocketEvents.JOIN, async (room, cb) => {
      socket.join(room);
      const players = await socket.in(room).fetchSockets();

      socket.to(room).emit(SocketEvents.JOIN, socket.id);
      cb(JSON.stringify(players.map((player) => player.id)));
    });

    // get available rooms
    socket.on(SocketEvents.GET_ROOMS, async (room, cb) => {
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
    socket.on(SocketEvents.GET_PLAYERS, async (room, cb) => {
      const users = io.sockets.adapter.rooms.get(room);
      console.log("USERS", users);
      cb(users);
    });

    // movement
    socket.on("move", (data) => {
      socket.broadcast.emit("movement", data);
    });
  });
}

export interface MessagePayload {
  message: string;
  room: string;
  user: string;
}

export enum SocketEvents {
  MESSAGE = "message",
  JOIN = "join",
  GET_ROOMS = "get-rooms",
  MOVE = "move",
  DISCONNECT = "disconnect",
  GET_PLAYERS = "get_players",
}

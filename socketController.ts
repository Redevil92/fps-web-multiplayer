import { Server } from "socket.io";

export default function socketController(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected --->", socket.id);

    socket.on(SocketEvents.CONNECT, () => {
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
      cb(players.map((player) => player.id));
    });

    // join a room
    socket.on(SocketEvents.EXIT_ROOM, async (room, cb) => {
      socket.leave(room);
      const players = await socket.in(room).fetchSockets();
      console.log("EXITING ROOM FOR", socket.id);

      socket.broadcast.to(room).emit(SocketEvents.EXIT_ROOM, socket.id);
      socket.emit(SocketEvents.EXIT_ROOM, socket.id);

      cb(players.map((player) => player.id));
    });

    // get available rooms
    socket.on(SocketEvents.GET_ROOMS, (cb) => {
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
    socket.on(SocketEvents.GET_PLAYERS, (room, cb) => {
      const users = io.sockets.adapter.rooms.get(room);
      console.log("USERS", users);
      cb(users);
    });

    // movement
    socket.on(SocketEvents.MOVE, (room, data) => {
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
  EXIT_ROOM = "exit-room",
  GET_ROOMS = "get-rooms",
  MOVE = "move",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  GET_PLAYERS = "get_players",
}

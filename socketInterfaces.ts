interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  message: (message: string) => void;
  join: (roomPlayers: string[]) => void;
  //exitRoom: (playerId: string) => void;
  //getRooms: (callback: (rooms: string[]) => void) => void;
  //getPlayers: (room: string, callback: (players: string[]) => void) => void;
  //move: (room: string, callback: (players: string[]) => void) => void;
}

interface ClientToServerEvents {
  //hello: () => void;

  connect: () => void;
  message: (data: MessageData, room: string) => void;
  join: (room: string, callback: (roomPlayers: string[]) => void) => void;
  exitRoom: (room: string, callback: (player: string) => void) => void;
  getRooms: (callback: (rooms: string[]) => void) => void;
  getPlayers: (room: string, callback: (players: string[]) => void) => void;
  move: (room: string, callback: (players: string[]) => void) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

interface MessageData {
  message: string;
}

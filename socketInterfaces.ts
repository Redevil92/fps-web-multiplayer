import { Vector3 } from "@react-three/fiber";
import { Euler } from "three";

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  message: (message: MessagePayload) => void;
  join: (userAndRoom: UserAndRoom) => void;
  exitRoom: (player: string) => void;
  move: (moveData: PlayerData) => void;
}

export interface ClientToServerEvents {
  connect: () => void;
  message: (data: MessageData, room: string) => void;
  join: (room: string, callback: (roomPlayers: string[]) => void) => void;
  exitRoom: (room: string, callback: (players: string[]) => void) => void;
  getRooms: (callback: (rooms: string[]) => void) => void;
  getPlayers: (room: string, callback: (players: string[]) => void) => void;
  move: (room: string, moveData: PlayerData) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

// possibly to move these interfaces to another file
export interface MessagePayload {
  message: string;
  room: string;
  user: string;
}

export interface MessageData {
  message: string;
}

export interface UserAndRoom {
  user: string;
  room: string;
}

export interface PlayerData {
  playerId: string;
  playerPosition: Vector3;
  // playerRotation: Euler;
}

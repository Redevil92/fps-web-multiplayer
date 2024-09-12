import { createContext } from "react";

interface RoomContextInterface {
  selectedRoom: string;
  roomPlayers: string[];
  setSelectedRoom: (room: string) => void;
  setRoomPlayers: (players: string[]) => void;
}

export const RoomContext = createContext<RoomContextInterface>({
  selectedRoom: "",
  roomPlayers: [],
  setSelectedRoom: () => {},
  setRoomPlayers: () => {},
});

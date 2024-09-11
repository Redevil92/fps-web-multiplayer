import { createContext } from "react";

interface RoomContextInterface {
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
}

export const RoomContext = createContext<RoomContextInterface>({
  selectedRoom: "",
  setSelectedRoom: () => {},
});

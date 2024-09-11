"use client";
import { useContext, useEffect, useState } from "react";
import { socket, userSocket } from "../../socket";
import { MessagePayload } from "@/socketInterfaces";
import { RoomContext } from "../context/roomContext";

export default function SelectedRoom() {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [roomPlayers, setRoomPlayer] = useState<string[]>([]);

  const roomContext = useContext(RoomContext);

  useEffect(() => {
    socket.on("message", displayMessage);
    socket.on("join", getRoomPlayers);
    socket.on("exitRoom", getRoomPlayers);

    return () => {
      socket.off("message", displayMessage);
      socket.off("join", getRoomPlayers);
      socket.off("exitRoom", getRoomPlayers);
    };
  }, []);

  useEffect(() => {
    getRoomPlayers();
  }, [roomContext.selectedRoom]);

  function onExitRoom() {
    socket.emit("exitRoom", roomContext.selectedRoom, () => {});
  }

  function displayMessage(messagePayload: MessagePayload) {
    console.log(messagePayload);
    if (messagePayload.room === roomContext.selectedRoom) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${messagePayload.user}: ${messagePayload.message}`,
      ]);
    }
  }

  function sendNewMessage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    socket.emit(
      "message",
      { message: messageToSend },
      roomContext.selectedRoom
    );
    setMessages((prevMessages) => [
      ...prevMessages,
      `${socket.id}: ${messageToSend}`,
    ]);
  }

  // TODO:  dispaly players in the room
  function getRoomPlayers() {
    socket.emit("getPlayers", roomContext.selectedRoom, (players: string[]) => {
      setRoomPlayer(players);
    });
  }

  // registered socket event for new people joining the room
  // registered socket event for new messages in the room

  return (
    <>
      <h1>Room {roomContext.selectedRoom}</h1>
      <p>Here is the room with id</p>
      <button onClick={onExitRoom} className="bg-slate-400 ml-2 ">
        EXIT ROOM
      </button>
      <hr />
      <input
        style={{ border: "1px solid black" }}
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
        type="text"
        name="myInput"
      />
      <button onClick={sendNewMessage}>SEND NEW MESSAGE</button>
      <hr />
      <div className="bg-zinc-300 p-2 mt-2">
        <div className="mb-2">PLAYER</div>
        <ul>
          {roomPlayers.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

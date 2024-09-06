"use client";
import { useEffect, useState } from "react";
import { socket, userSocket } from "../../socket";
import { MessagePayload, SocketEvents } from "@/socketController";

export default function SelectedRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [roomPlayers, setRoomPlayer] = useState<string[]>([]);

  useEffect(() => {
    socket.on(SocketEvents.MESSAGE, displayMessage);

    return () => {
      socket.off(SocketEvents.MESSAGE, displayMessage);
    };
  }, []);

  useEffect(() => {
    getRoomPlayers();
  }, [roomId]);

  const exitRoom = () => {};

  function displayMessage(messagePayload: MessagePayload) {
    console.log(messagePayload);
    if (messagePayload.room === roomId) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${messagePayload.user}: ${messagePayload.message}`,
      ]);
    }
  }

  function sendNewMessage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("EMIT", roomId);
    socket.emit("message", { message: messageToSend }, roomId);
    setMessages((prevMessages) => [
      ...prevMessages,
      `${socket.id}: ${messageToSend}`,
    ]);
  }

  // TODO:  dispaly players in the room
  function getRoomPlayers() {
    socket.emit(SocketEvents.GET_PLAYERS, roomId, (players: string[]) => {
      setRoomPlayer(players);
    });
  }

  // registered socket event for new people joining the room
  // registered socket event for new messages in the room

  return (
    <>
      <h1>Room {roomId}</h1>
      <p>Here is the room with id</p>
      <button onClick={exitRoom} className="bg-slate-400 ml-2 ">
        back to room list
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

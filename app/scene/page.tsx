"use client";
import FpsScene from "./FpsScene";
import SelectedRoom from "./selectedRoom";
import { socket, userSocket } from "../../socket";
import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/roomContext";

// create context to hold selected room and maybe players in the room

export default function Scene() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [userId, setUserId] = useState<string>("");

  const [messages, setMessages] = useState<string[]>([]);

  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", displayMessage);
    socket.on("exitRoom", removeJoinedRoomIfExited);

    userSocket.on("connect_error", displayMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", displayMessage);
      socket.off("exitRoom", removeJoinedRoomIfExited);
      socket.off("connect_error", displayMessage);
    };
  }, [userId]);

  function removeJoinedRoomIfExited(playerId: string) {
    if (playerId === userId) {
      setJoinedRoom("");
    }
  }

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);
    setUserId(socket.id || "");

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });

    getRooms();
  }

  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }

  function displayMessage(message: { message: string }) {
    setMessages((prevMessages) => [...prevMessages, message.message]);
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    socket.emit("message", { message: input }, joinedRoom);
  }

  function getRooms() {
    socket.emit("getRooms", (rooms: string[]) => {
      setAvailableRooms(rooms);
    });
  }

  // function joinRoom(room: string) {
  //   socket.emit("join", room, (playersInRoom: string[]) => {
  //     console.log(playersInRoom);
  //   });
  //   setJoinedRoom(room);
  // }

  function createAndJoinRoom(
    e: React.MouseEvent<HTMLButtonElement>,
    room: string
  ) {
    handleJoinRoom(e, room);
    setJoinedRoom(room);
  }

  function handleJoinRoom(
    e: React.MouseEvent<HTMLButtonElement>,
    roomToJoin: string
  ) {
    e.preventDefault();

    socket.emit("join", roomToJoin, (playersInRoom: string[]) => {
      console.log(playersInRoom);
    });

    getRooms();
  }

  const roomElements = availableRooms.map((availableRoom) => (
    <div key={availableRoom} className="border-2 border-red-300 m-1">
      {availableRoom}
      <button
        className="bg-slate-400 ml-2 "
        onClick={(e) => {
          handleJoinRoom(e, availableRoom);
          setJoinedRoom(availableRoom);
        }}
      >
        JOIN
      </button>
    </div>
  ));
  return (
    <RoomContext.Provider
      value={{ selectedRoom: joinedRoom, setSelectedRoom: setJoinedRoom }}
    >
      <div style={{ display: "flex" }}>
        <div>
          {/* <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p> */}
          <p>
            User id: <strong>{userId}</strong>
          </p>
          {joinedRoom ? (
            <SelectedRoom />
          ) : (
            <>
              <div className="border-2 border-spacing-1">
                ROOM AVAILABLE: <div>{roomElements}</div>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div>
                  Text input:{" "}
                  <input
                    style={{ border: "1px solid black" }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    name="myInput"
                  />
                  <button onClick={handleSubmit}>SEND</button>
                </div>
                <div style={{ marginTop: "10px" }}>
                  Room:{" "}
                  <input
                    style={{ border: "1px solid black" }}
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    type="text"
                    name="myInput"
                  />
                  <button onClick={(e) => createAndJoinRoom(e, room)}>
                    CREATE & JOIN
                  </button>
                </div>
              </div>
              <h3 style={{ marginTop: "20px" }}>SOCKET MESSAGES:</h3>
              <div>
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        {joinedRoom && <FpsScene roomId={joinedRoom} />}
      </div>
    </RoomContext.Provider>
  );
}

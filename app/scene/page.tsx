"use client";
import FpsScene from "./scene";
import { socket, userSocket } from "../../socket";
import { useEffect, useState } from "react";

export default function Scene() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [userId, setUserId] = useState<string>("");

  const [messages, setMessages] = useState<string[]>([]);

  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      setUserId(socket.id || "");

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("message", displayMessage);

    userSocket.on("connect_error", displayMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", displayMessage);
    };
  }, []);

  function displayMessage(message: { message: string }) {
    setMessages((prevMessages) => [...prevMessages, message.message]);
    console.log("MESSAGES", message);
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    socket.emit("message", { message: input }, room);
  }

  function handleJoinRoom(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    socket.emit("join", room, (message: string) => {
      displayMessage({ message: message });
    });
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
        <p>
          User id: <strong>{userId}</strong>
        </p>

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
            <button onClick={handleJoinRoom}>JOIN</button>
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
      </div>

      {/* <FpsScene /> */}
    </div>
  );
}

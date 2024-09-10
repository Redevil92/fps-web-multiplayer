"use client";

import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socketInterfaces";

const hostname = "localhost";
const port = 3000;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `http://${hostname}:${port}`
);

export const userSocket = io(`http://${hostname}:${port}/user`, {
  auth: { token: "token" },
});

"use client";

import { io } from "socket.io-client";

const hostname = "localhost";
const port = 3000;

export const socket = io(`http://${hostname}:${port}`);

import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const initSocket = async () => {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    reconnectionAttempts: Infinity,
    timeout: 10000,
    forceNew: true,
  });
};

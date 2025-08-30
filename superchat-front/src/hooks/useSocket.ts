import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  if (!socket) {
    socket = io('http://localhost:80/chat', { withCredentials: true });
  }
  return socket;
}
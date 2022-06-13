import { Server } from "socket.io";

let io: Server | undefined;

export const init = (httpServer: any, config: any) => {
  io = require("socket.io")(httpServer, config);
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

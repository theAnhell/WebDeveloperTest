"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.init = void 0;
let io;
const init = (httpServer, config) => {
    io = require("socket.io")(httpServer, config);
    return io;
};
exports.init = init;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map
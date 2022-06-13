"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//* Database management
const database_1 = __importDefault(require("./util/database"));
//* middlewares
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
//* routes
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const socket_1 = require("./util/socket");
const app = (0, express_1.default)();
//*middleware
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, compression_1.default)());
app.use(express_1.default.json()); // application/json
app.use((0, cors_1.default)());
//* routes
app.use("/api", restaurants_1.default);
app.use((err, req, res, next) => {
    if (err.isServer) {
        console.log(err);
    }
    res.status(err.output.statusCode).json(err.output.payload);
});
//* server init
const initServer = async () => {
    try {
        await database_1.default.sync();
        const server = require("http").createServer(app);
        const ioConnection = (0, socket_1.init)(server, { cors: { origin: "*" } });
        const port = process.env.PORT || 8080;
        console.log("Servidor corriendo en puerto " + port);
        ioConnection &&
            ioConnection.on("connection", () => {
                console.log("Client connected");
            });
        server.listen(port);
    }
    catch (err) {
        console.error("error", err);
    }
};
initServer();
//# sourceMappingURL=app.js.map
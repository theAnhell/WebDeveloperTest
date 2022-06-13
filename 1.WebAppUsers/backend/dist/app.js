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
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
//*middleware
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, compression_1.default)());
app.use(express_1.default.json()); // application/json
app.use((0, cors_1.default)());
//* routes
app.use("/api/auth", auth_1.default);
app.use("/api/dashboard", dashboard_1.default);
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
        const port = process.env.PORT || 8080;
        console.log("Servidor corriendo en puerto " + port);
        server.listen(port);
    }
    catch (err) {
        console.error("error", err);
    }
};
initServer();
//# sourceMappingURL=app.js.map
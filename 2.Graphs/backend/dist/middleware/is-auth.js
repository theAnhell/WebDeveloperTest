"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const boom_1 = __importDefault(require("@hapi/boom"));
exports.default = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return next(boom_1.default.unauthorized("No se paso la informacion correcta"));
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, "$77E2@%y4@9K" || "Secret");
    }
    catch (err) {
        return next(boom_1.default.serverUnavailable("Fallo al autenticar"));
    }
    if (!decodedToken) {
        return next(boom_1.default.unauthorized("No estas autorizado"));
    }
    next();
};
//# sourceMappingURL=is-auth.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const dashboard_1 = require("./../controllers/dashboard");
const router = express_1.default.Router();
//* Users
router.get("/users/:idUser", is_auth_1.default, dashboard_1.getUser);
router.get("/users", is_auth_1.default, dashboard_1.getAllUsers);
router.patch("/users/:idUser", is_auth_1.default, dashboard_1.patchUser);
router.delete("/users/:idUser", is_auth_1.default, dashboard_1.deleteUser);
exports.default = router;
//# sourceMappingURL=dashboard.js.map
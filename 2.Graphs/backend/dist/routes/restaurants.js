"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_1 = require("./../controllers/restaurants");
const express_1 = __importDefault(require("express"));
const restaurants_2 = require("../controllers/restaurants");
const router = express_1.default.Router();
//* Users
router.get("/restaurants/:idRestaurant", restaurants_2.getRestaurant);
router.get("/restaurants", restaurants_2.getAllRestaurants);
router.get("/populate", restaurants_1.populateDummyData);
router.patch("/distance/:idFrom/:idTo", restaurants_1.patchDistance);
exports.default = router;
//# sourceMappingURL=restaurants.js.map
import { patchDistance, populateDummyData } from "./../controllers/restaurants";
import express from "express";
import { getRestaurant, getAllRestaurants } from "../controllers/restaurants";

const router = express.Router();

//* Users
router.get("/restaurants/:idRestaurant", getRestaurant);
router.get("/restaurants", getAllRestaurants);
router.get("/populate", populateDummyData);
router.patch("/distance/:idFrom/:idTo", patchDistance);

export default router;

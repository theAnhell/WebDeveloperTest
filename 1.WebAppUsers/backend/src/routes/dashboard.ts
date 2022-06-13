import express from "express";
import isAuth from "../middleware/is-auth";
import {
  getUser,
  getAllUsers,
  patchUser,
  deleteUser,
} from "./../controllers/dashboard";

const router = express.Router();

//* Users
router.get("/users/:idUser", isAuth, getUser);
router.get("/users", isAuth, getAllUsers);
router.patch("/users/:idUser", isAuth, patchUser);
router.delete("/users/:idUser", isAuth, deleteUser);

export default router;

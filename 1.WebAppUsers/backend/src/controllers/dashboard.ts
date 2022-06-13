import { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs"; //encrypt password
import Boom from "@hapi/boom"; //errorHandling

//* Database models
import Users from "../models/users";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idUser = req.params.idUser;
  try {
    // Ignore attributes such as password, tries and created at, to not give unnecesary or dangerous information to the frontend ( dangerous such as the password )
    const foundUser = await Users.findByPk(idUser, {
      attributes: { exclude: ["password", "tries", "createdAt", "updatedAt"] },
    });
    if (!foundUser) return next(Boom.badData("This user doesn't exist"));
    res.status(200).json({ user: foundUser });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ignore attributes such as password, tries and created at, to not give unnecesary or dangerous information to the frontend ( dangerous such as the password )
    const allUsers = await Users.findAll({
      attributes: { exclude: ["password", "tries", "createdAt", "updatedAt"] },
    });
    res.status(200).json({ users: allUsers });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

export const patchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idUser = req.params.idUser;
  const names = req.body.names;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const resetPassword = req.body.resetPassword;
  try {
    if (resetPassword) {
      // Implemented a way to change the password if you are the admin or if you are your own user.
      const hashedPw = await bcrypt.hash(password, 12);
      await Users.update(
        { names, lastName, email, password: hashedPw, role },
        { where: { id: idUser } }
      );
    } else {
      await Users.update(
        { names, lastName, email, role },
        { where: { id: idUser } }
      );
    }
    res.status(201).json({ message: "This user was actualized" });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idUser = req.params.idUser;
  try {
    const foundUser = await Users.findByPk(idUser);
    if (!foundUser) return next(Boom.badData("This user doesn't exist"));
    await Users.destroy({ where: { id: idUser } });
    res.status(201).json({
      message: `The user ${foundUser.names} ${foundUser.lastName} has been deleted`,
    });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

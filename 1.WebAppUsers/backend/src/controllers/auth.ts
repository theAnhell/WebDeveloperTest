
import { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs"; //encrypt password
import { sign } from "jsonwebtoken"; //tokenSecurity
import Boom from "@hapi/boom"; //errorHandling

//* Database models
import Users from "../models/users";
import { differenceInMinutes } from "date-fns";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await Users.findOne({ where: { email: email } });

    if (!user) return next(Boom.unauthorized("This user doesn't exist."));

    // Check the database if there are 5 tries, if there are and more than 5 minutes have passed since this user was modified, clear the tries and let the user try again.
    if (user.tries >= 5) {
      const now = new Date();
      const lastUpdatedDate = new Date(user.updatedAt);
      if (differenceInMinutes(now, lastUpdatedDate) < 5) {
        return next(
          Boom.unauthorized(
            "You have reached the limit of tries, wait 5 minutes to try again."
          )
        );
      } else {
        await Users.update({ tries: 0 }, { where: { id: user.id } });
      }
    }
    const completeName = `${user.names} ${user.lastName}`;

    const isEqual = await bcrypt.compare(password, user.password);
    // Everytime it gets the password wrong it adds a try to the tries column in the database, once it reaches 5, the user can't no longer try connecting again for 5 minutes
    if (!isEqual) {
      await Users.update(
        { tries: (user.tries || 0) + 1 },
        { where: { id: user.id } }
      );
      return next(Boom.unauthorized("Wrong password"));
    }

    // The token expires in 12 hour, the frontend has an autologout method that logouts the user after the token expires.
    const token = sign(
      {
        email: email,
        id: user.id.toString(),
      },
      "$77E2@%y4@9K",
      { expiresIn: "12h" }
    );

    res.status(200).json({
      id: user.id,
      token: token,
      expiresIn: 43200,
      role: user.role,
      completeName: completeName,
    });
  } catch (err) {
    console.log(err);
    return next(Boom.badImplementation("An error occured"));
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const names = req.body.names;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const tries = 0;
  try {
    // Hashing the password so its harder to crack when seeing in the database.
    const hashedPw = await bcrypt.hash(password, 12);

    const [createdUser, isCreated] = await Users.findOrCreate({
      where: { email: email },
      defaults: {
        names: names,
        lastName: lastName,
        password: hashedPw,
        role: role,
        tries,
      },
    });

    if (isCreated) {
      // It's a new user.
      const token = sign(
        {
          email: createdUser.email,
          id: createdUser.id.toString(),
        },
        "$77E2@%y4@9K",
        { expiresIn: "12h" }
      );

      const completeName = `${createdUser.names} ${createdUser.lastName}`;

      // We send the token so that in the frontend it can automatically do a log-in.
      res.status(200).json({
        id: createdUser.id,
        token: token,
        expiresIn: 43200,
        role: createdUser.role,
        completeName: completeName,
      });
    } else {
      // We tell the user that this email is already in use.
      return next(Boom.conflict("This e-mail is already in use"));
    }
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

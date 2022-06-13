
import { NextFunction, Request, Response } from "express";

import Boom from "@hapi/boom"; //errorHandling

//* Database models
import Restaurants from "../models/restaurants";
import Distances from "../models/distance";
import { Op } from "sequelize";
import { getIO } from "../util/socket";

// This method finds a restaurant and all the restaurants that share a pair with it.
export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idRestaurant = +req.params.idRestaurant;
  try {
    // First we find the restaurant and make sure it exist on the  database.
    const foundRestaurant = await Restaurants.findByPk(idRestaurant);
    if (!foundRestaurant)
      return next(Boom.badData("This restaurant doesn't exist"));
    const restaurantDistances = await Distances.findAll({
      where: {
        [Op.or]: [{ from: idRestaurant }, { to: idRestaurant }],
      },
    });

    // We get the distances and modify them if necessary so they are easier to read on the frontend.
    const modifiedRestaurants = restaurantDistances.map((resDis) => {
      if (resDis.from === idRestaurant) {
        return {
          id: resDis.id,
          from: resDis.from,
          to: resDis.to,
          distance: resDis.distance,
        };
      } else {
        //* We exchange To and From to be easire to read on the frontend
        return {
          id: resDis.id,
          from: resDis.to,
          to: resDis.from,
          distance: resDis.distance,
        };
      }
    });

    res
      .status(200)
      .json({ restaurant: foundRestaurant, distances: modifiedRestaurants });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurants = await Restaurants.findAll();
    res.status(200).json({ restaurants });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

export const populateDummyData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Random list of Restaurants names.
  const listRestaurants = [
    "No Name Restaurant",
    "Killer Pizza from Mars",
    "The French Laundry",
    "Starbelly",
    "Egg Brunch",
    "Goosefoot",
    "Garage Kitchen + Bar",
    "Mr. & Mrs. Bun",
    "Six Seven",
    "Gochew Grill",
    "Zero Zero",
    "Girl and the Goat",
    "Odd Duck",
    "Toro Toro",
    "The Purple Pig",
    "Bite Me Sandwiches",
    "The Pink Door",
    "Blue Mermaid",
  ];
  try {
    for (const rest of listRestaurants) {
       await Restaurants.findOrCreate({
        where: { name: rest },
      });
    }
    // We get the restaurants with their ids.
    const allRestaurantsRightNow = await Restaurants.findAll();
    // We make pairs of their ids to populate a Distance tables that cares about from which restaurant, and to which restaurant, how much is the distance between them. 
    const pairs: Array<{ from: number; to: number; distance: number | null }> =
      [];
    allRestaurantsRightNow.forEach((res, i) => {
      allRestaurantsRightNow.forEach((r, j) => {
        if (res.id !== r.id && j > i) {
          pairs.push({
            from: res.id,
            to: r.id,
            distance:
              Math.random() >= 0.5 ? +(Math.random() * 100).toFixed(2) : null, // We use a random number generator ( I know that node Math.random isn't reliable but I used it for this test for convenience)
              //50/50 between choosing a number or not, and if it wins, it generates another number and multiplies it by 100 to get some random distance from 0 to 100 KM.
          });
        }
      });
    });

    // Create the distances in the database so that the program can see them.
    for (const pair of pairs) {
      if (pair.distance)
        await Distances.findOrCreate({
          where: { from: pair.from, to: pair.to },
          defaults: {
            distance: pair.distance,
          },
        });
    }
    res.status(200).json({});
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

// This is what runs everytime the value changes on the input. 
export const patchDistance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idFrom = +req.params.idFrom;
  const idTo = +req.params.idTo;
  const distance = typeof req.body.distance === "string" ? 0 : +req.body.distance;

  try {
    const idF = idFrom > idTo ? idTo : idFrom;
    const idT = idFrom > idTo ? idFrom : idTo;

    // Make sure that the id for From is smaller than the id from To, for convenience for the table,
    //so that it doesnt make a pair like [2,18] into [18,2], which are the same.

    const [foundDistance, isCreate] = await Distances.findOrCreate({
      where: { to: idT, from: idF },
      defaults: { distance: distance },
      raw: true,
    });
    if (isCreate) {
      //if it was created its the first time that this pair of ids exist.
      const emitMessage = { action: "newDistance", distance: foundDistance };
      //emit a message with the distance so that the frontend can make data manipulation, with the action message of "new"
      getIO().emit("distance", emitMessage);
    } else {
      //if already exist then we gotta update the distance value to the new one then send it to the socket;
      await Distances.update(
        { distance: distance },
        { where: { id: foundDistance.id } }
      );
      // After we update it in the database, we emit a message with sockets so the frotend can read it and manipulate the data, with an action message of "update"
      const emitMessage = {
        action: "updatedDistance",
        distance: { ...foundDistance, distance: distance },
      };
      getIO().emit("distance", emitMessage);
    }
    res.status(201).json({ message: "succesfull" });
  } catch (err) {
    return next(Boom.badImplementation("An error occured"));
  }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Boom from "@hapi/boom";

// Simple auth verification, first it checks if the authorization header is provided, then it verifys if the token sent was decrypted using the same key, 
//if it was, it lets the function go to the next stage.
export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(Boom.unauthorized("No se paso la informacion correcta"));
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "$77E2@%y4@9K" || "Secret");
  } catch (err) {
    return next(Boom.serverUnavailable("Fallo al autenticar"));
  }
  if (!decodedToken) {
    return next(Boom.unauthorized("No estas autorizado"));
  }

  next();
};

import express, { NextFunction, Request, Response } from "express";

//* Database management
import database from "./util/database";

//* middlewares
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

//* routes
import restaurantRoutes from "./routes/restaurants";
import { init } from "./util/socket";

const app = express();

//*middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json()); // application/json

app.use(cors());

//* routes
app.use("/api", restaurantRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.isServer) {
    console.log(err);
  }
  res.status(err.output.statusCode).json(err.output.payload);
});

//* server init

const initServer = async () => {
  try {
    await database.sync();
    const server = require("http").createServer(app);
    const ioConnection = init(server, { cors: { origin: "*" } });

    const port = process.env.PORT || 8080;
    console.log("Servidor corriendo en puerto " + port);

    ioConnection &&
      ioConnection.on("connection", () => {
        console.log("Client connected");
      });

    server.listen(port);
  } catch (err) {
    console.error("error", err);
  }
};

initServer();

import http from "http";
import express, { response } from "express";
import sequelize from "./config/sequelizeConfig.js";
import dotenv from "dotenv";
import { authController } from "./controllers/authController.js";
import { dbController } from "./controllers/dbController.js";
import { userController } from "./controllers/userController.js";
import { cityController } from "./controllers/cityController.js";
import { estateController } from "./controllers/estateController.js";
import { estateTypeController } from "./controllers/estateTypeController.js";
import { energyLabelController } from "./controllers/energyLabelController.js";

dotenv.config();

// Initialiserer Express-applikationen
const app = express();
const port = process.env.SERVERPORT || 4000;

app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tilføjer controller som middleware
app.use(dbController, authController);

app.use(
  cityController,
  userController,
  estateController,
  estateTypeController,
  energyLabelController
);


//Route til root
app.get("/", (req, res) => {
  console.log("Hej verden");
  res.send("Hello world");
});


//Route til 404
app.get("*", (req, res) => {
  res.send("Could not find file");
});

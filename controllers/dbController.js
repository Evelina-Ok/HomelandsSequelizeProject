// Importerer express og testModel
import express from 'express';
import sequelize from '../config/sequelizeConfig.js';


// Opretter en router
export const dbController = express.Router();

dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync({ force: true });
    res.send("Data synchronized successfully");
  } catch (error) {
    console.error("Sync error", error);
    res.status(500).send(`Error syncing database: ${error.message}`);
  }
});
// Importerer express og testModel
import express from 'express';
import sequelize from '../config/sequelizeConfig.js';


// Opretter en router
export const dbController = express.Router();

dbController.get("/sync", async (req, res) => {
  try {
    const forceSync = req.query.force === 'true';
    await sequelize.sync({ force: forceSync });
    res.send(`Database synchronized ${forceSync ? 'with force' : 'without force'}`);
  } catch (error) {
      res.status(500).json( `Error syncing database: ${error.message}`);
  }
});




/* dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync({ force: true });
    res.send("Data synchronized successfully");
  } catch (error) {
    console.error("Sync error", error);
    res.status(500).send(`Error syncing database: ${error.message}`);
  }
}); */
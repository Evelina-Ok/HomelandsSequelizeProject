// Importerer express og testModel
import express from 'express';
import sequelize from '../config/sequelizeConfig.js';
import { seedFromCsv } from '../utils/seedUtils.js';
import { cityModel } from '../models/cityModel.js';
import { estateModel } from '../models/estateModel.js';
import { userModel } from '../models/userModel.js';
import { energyLabelModel } from '../models/energyLabelModel.js';
import { favouriteModel } from '../models/favouritesModel.js';
import { imageModel } from '../models/imageModel.js';
import { reviewsModel } from '../models/reviewsModel.js';
import { staffModel } from '../models/staffModel.js';
import { estateTypeModel } from '../models/estateTypeModel.js';
import { estateImageRelModel } from '../models/estateImageRelModel.js';


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

dbController.get("/seedfromcsv", async (req, res) => {
  try {
    await seedFromCsv("city.csv", cityModel);
    await seedFromCsv("energy-label.csv", energyLabelModel);
    await seedFromCsv("image.csv", imageModel);
    await seedFromCsv("estate-type.csv", estateTypeModel);
    await seedFromCsv("estate.csv", estateModel);
    await seedFromCsv("estate-image-rel.csv", estateImageRelModel);
    await seedFromCsv("staff.csv", staffModel);
    await seedFromCsv("user.csv", userModel);
    await seedFromCsv("review.csv", reviewsModel);
    await seedFromCsv("favorite.csv", favouriteModel);


    res.send(`Seeding completed`);
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
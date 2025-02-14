// Importerer express og testModel
import express from "express";
import { estateTypeModel } from "../models/estateTypeModel.js";
import { estateModel } from "../models/estateModel.js";
import { cityModel } from "../models/cityModel.js";
import { energyLabelModel } from "../models/energyLabelModel.js";
import { imageModel } from "../models/imageModel.js";
import { estateImageRelModel } from "../models/estateImageRelModel.js";

// Opretter en router
export const estateController = express.Router();

// Definerer relationen mellem estate modellen og by modellen
estateModel.belongsTo(cityModel);
cityModel.hasMany(estateModel);

// Defines relation between estate model and estate type model
estateModel.belongsTo(estateTypeModel);
estateTypeModel.hasMany(estateModel);

// Defines relation between estate model and energy label model
estateModel.belongsTo(energyLabelModel);
energyLabelModel.hasMany(estateModel);

estateModel.belongsToMany(imageModel, {through: estateImageRelModel})
imageModel.belongsToMany(estateModel, {through: estateImageRelModel})


//READ: Route til at hente liste
estateController.get("/estates", async (req, res) => {
  try {
    //Henter alle biler fra databasen ved at kalde findAll på carModel
    const estates = await estateModel.findAll({
      attributes: ["id", "brand"],
    });
    //Tjekker om listen er tom eller undefined
    if (!estates || estates.length === 0) {
      //Returnerer 404, hvis ingen biler er fundet
      return res.status(404).json({ message: "Ingen estates fundet" });
    }
    //Returnerer listen af biler so JSON
    res.json(estates);
  } catch (error) {
    res.status(500).send({
      message: `Fejl i kald af estateModel: ${error}`,
    });
  }
});

//READ: Route til at hente detaljer
estateController.get("/estates/:id([0-9]*)", async (req, res) => {
  try {
    //Konvertere ID til heltal
    const { id } = req.params;

    //Finder estate i databasen baseret på id
    const result = await estateModel.findOne({
      where: { id: id },
      attributes: ["brand"],
    });

    //Hvis estate ikke findes returneres en 404-fejl
    if (!result) {
      return res
        .status(404)
        .json({ message: `Could not find estate with id #${id}` });
    }

    //Returnerer estate data som JSON
    res.json(result);

    //Returnerer en 500-fejl
  } catch (error) {
    res
      .status(500)
      .json({ message: `Fejl i kald af estateModel: ${error.message}` });
  }
});

//CREATE: Route til at oprette
estateController.post("/estates", async (req, res) => {
  // console.log(req.body);

  const {
    address,
    price,
    payout,
    gross,
    net,
    cost,
    num_rooms,
    num_floors,
    floor_space,
    ground_space,
    basement_space,
    year_of_construction,
    year_rebuilt,
    description,
    floorplan,
    num_clicks,
    city_id,
    type_id,
    energy_label_id,
  } = req.body;

  if (
    !address ||
    !price ||
    !payout ||
    !gross ||
    !net ||
    !cost ||
    !num_rooms ||
    !num_floors ||
    !floor_space ||
    !ground_space ||
    !basement_space ||
    !year_of_construction ||
    !year_rebuilt ||
    !description ||
    !floorplan ||
    !num_clicks ||
    !city_id ||
    !type_id ||
    !energy_label_id
  ) {
    return res.status(400).json({ message: "Du skal udfylde alle felter" });
  }

  try {
    // const result = await estateModel.create(req.body);
    const result = await estateModel.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("Fejl ved oprettelse af estate:", error);

    res
      .status(500)
      .json({ message: `Fejl i oprettelse af estateModel: ${error.message} ` });
  }
});

//put - update. Routes to update
estateController.put("/estates", async (req, res) => {
  const { id, name } = req.body;

  if (id && name) {
    try {
      const result = await estateModel.update({ name }, { where: { id } });

      if (result[0] > 0) {
        res.status(200).json({
          message: `estate med id ${id} opdateret til ${name}`,
        });
      } else {
        res.status(404).json({ message: `estate med ${id} ikke fundet` });
      }
    } catch (error) {
      res.status(500).json({
        message: `Fejl ved opdatering af estateModel: ${error.message}`,
      });
    }
  } else {
    res.status(400).send({
      message: "Fejl i opdatering af estateModel: Mangler data",
    });
  }
});

// Route til at slette en bil baseret på ID
estateController.delete("/estates/:id([0-9]+)", async (req, res) => {
  // Henter ID fra URL-parametrene
  const id = parseInt(req.params.id, 10);

  // Tjekker om et ID er angivet
  if (id) {
    try {
      // Forsøger at slette estate fra databasen baseret på ID
      await estateModel.destroy({
        where: { id },
      });

      // Returnerer succesbesked
      res.status(200).send({
        message: `Record #${id} is deleted`,
      });
    } catch (error) {
      // Send en HTTP-statuskode 500 hvis der opstår en fejl
      res.status(500).send({
        message: `Kunne ikke slette estate: ${error.message}`,
      });
    }
  } else {
    // Sender 400 Bad Request-fejl hvis ID er ugyldigt
    res.status(400).send({
      message: "Id er ugyldigt",
    });
  }
});

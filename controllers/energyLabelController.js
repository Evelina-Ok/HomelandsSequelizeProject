// Importerer express og testModel
import express from "express";
import { energyLabelModel } from "../models/energyLabelModel.js"; 

// Opretter en router
export const energyLabelController = express.Router();

//READ: Route til at hente liste
energyLabelController.get("/energy_labels", async (req, res) => {
  try {
    //Henter alle types fra databasen ved at kalde findAll på energyLabelModel
    const energyLabels = await energyLabelModel.findAll({
      attributes: ["id", "name"],
    });
    //Tjekker om listen er tom eller undefined
    if (!energyLabels || energyLabels.length === 0) {
      //Returnerer 404, hvis ingen biler er fundet
      return res.status(404).json({ message: "No energy label was found" });
    }
    //Returnerer listen af biler so JSON
    res.json(energyLabels);
  } catch (error) {
    res.status(500).send({
      message: `Fejl i kald af energyLabelModel: ${error}`,
    });
  }
});

//READ: Route til at hente detaljer
energyLabelController.get("/energy_labels/:id([0-9]*)", async (req, res) => {
  try {
    //Konvertere ID til heltal
    const { id } = req.params;

    //Finder bilen i databasen baseret på id
    const result = await energyLabelModel.findOne({
      where: { id: id },
      attributes: ["name"],
    });

    //Hvis bilen ikke findes returneres en 404-fejl
    if (!result) {
      return res
        .status(404)
        .json({ message: `Could not find energy label with id #${id}` });
    }

    //Returnerer bilens data som JSON
    res.json(result);

    //Returnerer en 500-fejl
  } catch (error) {
    res
      .status(500)
      .json({ message: `Fejl i kald af energyLabelModel: ${error.message}` });
  }
});

//CREATE: Route til at oprette
energyLabelController.post("/energy_labels", async (req, res) => {
  // Takes name and logo from request body
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Du skal udfylde alle felter" });
  }

  try {
    // const result = await energyLabelModel.create(req.body);
    const result = await energyLabelModel.create({ name });

    res.status(201).json(result);
  } catch (error) {
    console.error("Fejl ved oprettelse af estate type:", error);

    res
      .status(500)
      .json({ message: `Fejl i oprettelse af energyLabelModel: ${error.message} ` });
  }
});

//put - update. Routes to update
energyLabelController.put("/energy_labels", async (req, res) => {
  const { id, name } = req.body;

  if (id && name) {
    try {
      const result = await energyLabelModel.update({ name }, { where: { id } });

      if (result[0] > 0) {
        res.status(200).json({
          message: `Energy label med id ${id} opdateret til ${name}`,
        });
      } else {
        res.status(404).json({ message: `Energy label med ${id} ikke fundet` });
      }
    } catch (error) {
      res.status(500).json({
        message: `Fejl ved opdatering af energyLabelModel: ${error.message}`,
      });
    }
  } else {
    res.status(400).send({
      message: "Fejl i opdatering af energyLabelModel: Mangler data",
    });
  }
});

// Route til at slette en estate type baseret på ID
energyLabelController.delete("/estate_types/:id([0-9]+)", async (req, res) => {
  // Henter ID fra URL-parametrene
  const id = parseInt(req.params.id, 10);

  // Tjekker om et ID er angivet
  if (id) {
    try {
      // Forsøger at slette energy label fra databasen baseret på ID
      await energyLabelModel.destroy({
        where: { id },
      });

      // Returnerer succesbesked
      res.status(200).send({
        message: `Record #${id} is deleted`,
      });
    } catch (error) {
      // Send en HTTP-statuskode 500 hvis der opstår en fejl
      res.status(500).send({
        message: `Kunne ikke slette energy label: ${error.message}`,
      });
    }
  } else {
    // Sender 400 Bad Request-fejl hvis ID er ugyldigt
    res.status(400).send({
      message: "Id er ugyldigt",
    });
  }
})

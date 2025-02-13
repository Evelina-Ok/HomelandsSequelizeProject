// Importerer express og testModel
import express from "express";
import { reviewsModel } from "../models/reviewsModel.js";

// Opretter en router
export const reviewsController = express.Router();


//READ: Route til at hente liste
reviewsController.get("/reviews", async (req, res) => {
  try {
    //Henter alle reviews fra databasen ved at kalde findAll på carModel
    const reviews = await reviewsModel.findAll({
      attributes: ["id", "brand"],
    });
    //Tjekker om listen er tom eller undefined
    if (!reviews || reviews.length === 0) {
      //Returnerer 404, hvis ingen reviews er fundet
      return res.status(404).json({ message: "Ingen reviews fundet" });
    }
    //Returnerer listen af reviews so JSON
    res.json(reviews);
  } catch (error) {
    res.status(500).send({
      message: `Fejl i kald af reviewsModel: ${error}`,
    });
  }
});

//READ: Route til at hente detaljer
reviewsController.get("/reviews/:id([0-9]*)", async (req, res) => {
  try {
    //Konvertere ID til heltal
    const { id } = req.params;

    //Finder reviews i databasen baseret på id
    const result = await reviewsModel.findOne({
      where: { id: id },
      attributes: ["brand"],
    });

    //Hvis reviews ikke findes returneres en 404-fejl
    if (!result) {
      return res
        .status(404)
        .json({ message: `Could not find reviews with id #${id}` });
    }

    //Returnerer reviews data som JSON
    res.json(result);

    //Returnerer en 500-fejl
  } catch (error) {
    res
      .status(500)
      .json({ message: `Fejl i kald af reviewsModel: ${error.message}` });
  }
});

//CREATE: Route til at oprette
reviewsController.post("/reviews", async (req, res) => {
  // Takes name and logo from request body
  const { name, logo } = req.body;

  if (!name || !logo) {
    return res.status(400).json({ message: "Du skal udfylde alle felter" });
  }

  try {
    // const result = await reviewsModel.create(req.body);
    const result = await reviewsModel.create({ name, logo });

    res.status(201).json(result);
  } catch (error) {
    console.error("Fejl ved oprettelse af estate:", error);

    res
      .status(500)
      .json({ message: `Fejl i oprettelse af reviewsModel: ${error.message} ` });
  }
});

//put - update. Routes to update
reviewsController.put("/reviews", async (req, res) => {
  const { id, name } = req.body;

  if (id && name) {
    try {
      const result = await reviewsModel.update({ name }, { where: { id } });

      if (result[0] > 0) {
        res.status(200).json({
          message: `reviews med id ${id} opdateret til ${name}`,
        });
      } else {
        res.status(404).json({ message: `reviews med ${id} ikke fundet` });
      }
    } catch (error) {
      res.status(500).json({
        message: `Fejl ved opdatering af reviewsModel: ${error.message}`,
      });
    }
  } else {
    res.status(400).send({
      message: "Fejl i opdatering af reviewsModel: Mangler data",
    });
  }
});

// Route til at slette en bil baseret på ID
reviewsController.delete("/reviews/:id([0-9]+)", async (req, res) => {
  // Henter ID fra URL-parametrene
  const id = parseInt(req.params.id, 10);

  // Tjekker om et ID er angivet
  if (id) {
    try {
      // Forsøger at slette reviews fra databasen baseret på ID
      await reviewsModel.destroy({
        where: { id },
      });

      // Returnerer succesbesked
      res.status(200).send({
        message: `Record #${id} is deleted`,
      });
    } catch (error) {
      // Send en HTTP-statuskode 500 hvis der opstår en fejl
      res.status(500).send({
        message: `Kunne ikke slette reviews: ${error.message}`,
      });
    }
  } else {
    // Sender 400 Bad Request-fejl hvis ID er ugyldigt
    res.status(400).send({
      message: "Id er ugyldigt",
    });
  }
})

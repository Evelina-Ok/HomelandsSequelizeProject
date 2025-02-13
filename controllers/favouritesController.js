// Importerer express og testModel
import express from "express";
import { favouritesModel } from "../models/favouritesModel.js";

// Opretter en router
export const favouritesController = express.Router();


//-- Route til at hente liste
favouritesController.get("/favourites", async (req, res) => {
    try {
      //Henter alle byer fra databasen ved at kalde findAll på favouritesModel
      const favourites = await favouritesModel.findAll({
        attributes: ["id", "user_id", "estate_id"],
      });
      //Tjekker om listen er tom eller undefined
      if (!favourites || favourites.length === 0) {
        //Returnerer 404, hvis ingen biler er fundet
        return res.status(404).json({ message: "No favourites found" });
      }
      //Returnerer listen af favourites so JSON
      res.json(favourites);
    } catch (error) {
      res.status(500).send({
        message: `Error fetching favouritesModel: ${error}`,
      });
    }
  });


  //-- Route til at hente detaljer
  favouritesController.get("/favourites/:id([0-9]*)", async (req, res) => {
    try {
      //Konvertere ID til heltal
      const { id } = req.params;
  
      //Finder favourites i databasen baseret på id
      const result = await favouritesModel.findOne({
        where: { id: id },
        attributes: ["user_id", "estate_id"],
      });
  
      //Hvis by ikke findes returneres en 404-fejl
      if (!result) {
        return res
          .status(404)
          .json({ message: `Could not find favourites with id #${id}` });
      }
  
      //Returnerer favourites data som JSON
      res.json(result);
  
      //Returnerer en 500-fejl
    } catch (error) {
      res
        .status(500)
        .json({ message: `Fejl i kald af favouritesModel: ${error.message}` });
    }
  });



  //--CREATE: Route til at oprette
  favouritesController.post("/favourites", async (req, res) => {
    const { user_id, estate_id } = req.body;
  
    if (!user_id || !estate_id ) {
      return res.status(400).json({ message: "Du skal udfylde alle felter" });
    }
  
    try {
      // const result = await favouritesModel.create(req.body);
      const result = await favouritesModel.create({ user_id, estate_id });
  
      res.status(201).json(result);
    } catch (error) {
      console.error("Error of creating a favourite:", error);
  
      res
        .status(500)
        .json({ message: `Error of creating a favouritesModel: ${error.message} ` });
    }
  });
  
    
  // Route til at slette en favourite baseret på ID
  favouritesController.delete("/favourites/:id([0-9]+)", async (req, res) => {
    // Henter ID fra URL-parametrene
    const { id } = req.params;
  
    // Tjekker om et ID er angivet
    if (id) {
      try {
        // Forsøger at slette favourite fra databasen baseret på ID
        await favouritesModel.destroy({
          where: { id },
        });
  
        // Returnerer succesbesked
        res.status(200).send({
          message: `Record #${id} is deleted`,
        });
      } catch (error) {
        // Send en HTTP-statuskode 500 hvis der opstår en fejl
        res.status(500).send({
          message: `Kunne ikke slette favourite: ${error.message}`,
        });
      }
    } else {
      // Sender 400 Bad Request-fejl hvis ID er ugyldigt
      res.status(400).send({
        message: "Id er ugyldigt",
      });
    }
  })
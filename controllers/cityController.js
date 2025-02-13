// Importerer express og testModel
import express from "express";
import { cityModel } from "../models/cityModel.js";

// Opretter en router
export const cityController = express.Router();


//-- Route til at hente liste
cityController.get("/cities", async (req, res) => {
    try {
      //Henter alle byer fra databasen ved at kalde findAll på carModel
      const cities = await cityModel.findAll({
        attributes: ["id", "zipcode", "name"],
      });
      //Tjekker om listen er tom eller undefined
      if (!cities || cities.length === 0) {
        //Returnerer 404, hvis ingen biler er fundet
        return res.status(404).json({ message: "No cities found" });
      }
      //Returnerer listen af byer so JSON
      res.json(cities);
    } catch (error) {
      res.status(500).send({
        message: `Error fetching cityModel: ${error}`,
      });
    }
  });


  //-- Route til at hente detaljer
cityController.get("/cities/:id([0-9]*)", async (req, res) => {
    try {
      //Konvertere ID til heltal
      const { id } = req.params;
  
      //Finder byer i databasen baseret på id
      const result = await cityModel.findOne({
        where: { id: id },
        attributes: ["zipcode", "name"],
      });
  
      //Hvis by ikke findes returneres en 404-fejl
      if (!result) {
        return res
          .status(404)
          .json({ message: `Could not find city with id #${id}` });
      }
  
      //Returnerer bilens data som JSON
      res.json(result);
  
      //Returnerer en 500-fejl
    } catch (error) {
      res
        .status(500)
        .json({ message: `Fejl i kald af CityModel: ${error.message}` });
    }
  });



  //--CREATE: Route til at oprette
cityController.post("/cities", async (req, res) => {
    const { zipcode, name } = req.body;
  
    if (!zipcode || !name ) {
      return res.status(400).json({ message: "Du skal udfylde alle felter" });
    }
  
    try {
      // const result = await cityModel.create(req.body);
      const result = await cityModel.create({ zipcode, name });
  
      res.status(201).json(result);
    } catch (error) {
      console.error("Error of creating a city:", error);
  
      res
        .status(500)
        .json({ message: `Error of creating a cityModel: ${error.message} ` });
    }
  });
  
  //put - update
  cityController.put("/cities", async (req, res) => {
    const { id, zipcode, name } = req.body;
  
    if (id && name) {
      try {
        const result = await cityModel.update({ name }, { where: { id } });
  
        if (result[0] > 0) {
          res.status(200).json({
            message: `By med id ${id} og navn ${name}`,
          });
        } else {
          res.status(404).json({ message: `By med ${id} ikke fundet` });
        }
      } catch (error) {
        res.status(500).json({
          message: `Fejl ved opdatering af CityModel: ${error.message}`,
        });
      }
    } else {
      res.status(400).send({
        message: "Fejl i opdatering af CityModel: Mangler data",
      });
    }
  });
  
  // Route til at slette en by baseret på ID
  cityController.delete("/cities/:id([0-9]+)", async (req, res) => {
    // Henter ID fra URL-parametrene
    const { id } = req.params;
  
    // Tjekker om et ID er angivet
    if (id) {
      try {
        // Forsøger at slette city fra databasen baseret på ID
        await cityModel.destroy({
          where: { id },
        });
  
        // Returnerer succesbesked
        res.status(200).send({
          message: `Record #${id} is deleted`,
        });
      } catch (error) {
        // Send en HTTP-statuskode 500 hvis der opstår en fejl
        res.status(500).send({
          message: `Kunne ikke slette byen: ${error.message}`,
        });
      }
    } else {
      // Sender 400 Bad Request-fejl hvis ID er ugyldigt
      res.status(400).send({
        message: "Id er ugyldigt",
      });
    }
  })
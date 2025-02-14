import express from "express";
import { userModel } from "../models/userModel.js";

export const userController = express.Router();

// Fetch all users from database
userController.get("/users", async (req, res) => {
  try {
    const data = await userModel.findAll({
      attributes: {exclude: ["password"]},
    //   attributes: ["id", "firstname", "lastname"],

    });

    if (!data || data.length === 0) {
      return res.json({ message: "No data found" });
    }
    res.json(data);
  } catch (error) {
    console.error(`Could not get user list: ${error}`);
    res.status(500).send({
      message: `Error fetching user list: ${error.message}`,
    });
  }
});

// Fetch a single user by ID
userController.get("/users/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await userModel.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      message: `Error fetching user: ${error.message}`,
    });
  }
});

// Route to create (CREATE)
userController.post("/users", async (req, res) => {
  const { firstname, lastname, email, password, refresh_token, is_active } =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !refresh_token ||
    !is_active
  ) {
    return res.json({ message: "Missing required data" });
  }

  try {
    const result = await userModel.create({
      firstname,
      lastname,
      email,
      password,
      refresh_token,
      is_active,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
});

// Route to update (UPDATE)
userController.put("/users", async (req, res) => {
  const { id, firstname, lastname, email, password, refresh_token, is_active } =
    req.body;

  if (
    !id ||
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !refresh_token ||
    !is_active 
  ) {
    return res.json({ message: "Missing required data" });
  }

  try {
    const result = await userModel.update(
      {
        firstname,
        lastname,
        email,
        password,
        refresh_token,
        is_active,
      }, // Update only relevant fields
      {
        where: { id },
      }
    );
    // If no rows were updated, the user ID does not exist
    if (result[0] === 0) {
      return res.status(404).json({ message: `No user found with ID: ${id}` });
    }
    res
      .status(200)
      .json({ message: `User with ID ${id} updated successfully.` });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({
      message: `Error updating user: ${error.message}`,
    });
  }
});

// Route to delete (DELETE)
userController.delete("/users/:id([0-9]*)", async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      await userModel.destroy({
        where: { id },
      });
      res.status(200).send({
        message: `User deleted successfully`, // Success response
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({
        message: `Could not delete user: ${error.message}`, // Error message
      });
    }
  } else {
    // Send a 400 Bad Request error if the ID is missing or invalid
    res.status(400).send({
      message: "Invalid ID",
    });
  }
});

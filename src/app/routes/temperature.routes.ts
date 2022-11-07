import TemperatureController from "../controllers/temperature.controller.js";
import express from "express";

const temperatureRoutes = () => {
  const router = express.Router();

  const controller = new TemperatureController();

  // Retrieve all temperatures
  router.get("/", controller.getAll);

  // Retrieve a single temperature with id
  router.get("/:id", controller.getOne);

  // Create a new temperature
  router.post("/", controller.create);

  // Update a temperature with id
  router.put("/:id", controller.update);

  // Delete a temperature with id
  router.delete("/:id", controller.deleteT);

  // Delete all temperatures
  router.delete("/", controller.deleteAll);

  return router;
};

export default temperatureRoutes;
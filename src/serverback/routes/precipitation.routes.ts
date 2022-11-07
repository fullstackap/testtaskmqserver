import PrecipitationController from "../controllers/precipitation.controller.js"
import express from "express";

const precipitationRoutes = () => {
  const router = express.Router();

  const controller = new PrecipitationController();

  // Get all precipitations
  router.get("/", controller.getAll);

  // Get a single precipitations with id
  router.get("/:id", controller.getOne);

  // Create a new precipitations
  router.post("/", controller.create);

  // Update a precipitations with id
  router.put("/:id", controller.update);

  // Delete a precipitation with id
  router.delete("/:id", controller.deleteP);

  // Delete all precipitations
  router.delete("/", controller.deleteAll);

  return router;
};

export default precipitationRoutes;
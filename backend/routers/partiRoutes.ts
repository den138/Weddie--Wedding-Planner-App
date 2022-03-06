import express from "express";
import { knex } from "../app";
import { PartiController } from "../controllers/PartiController";
import { PartiService } from "../services/PartiService";
import { asyncWrapper } from "../utils/asyncWrapper";

const partiService = new PartiService(knex);
const partiController = new PartiController(partiService);

export const partiRoutes = express.Router();

partiRoutes.get("/list/:id", asyncWrapper(partiController.getPartiList));
partiRoutes.post("/", asyncWrapper(partiController.addParti));
partiRoutes.put("/", asyncWrapper(partiController.updateParti));
partiRoutes.delete("/:id", asyncWrapper(partiController.deleteParti));

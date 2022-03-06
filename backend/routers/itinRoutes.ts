import express from "express";
import { knex } from "../app";
import { asyncWrapper } from "../utils/asyncWrapper";
import { ItinService } from "../services/ItinService";
import { ItinController } from "../controllers/ItinController";

const itinService = new ItinService(knex);
const itinController = new ItinController(itinService);

export const itinRoutes = express.Router();

itinRoutes.get("/list/:id", asyncWrapper(itinController.getItinList));
itinRoutes.get("/me/:id", asyncWrapper(itinController.getMyItinList));
itinRoutes.post("/", asyncWrapper(itinController.addItin));
itinRoutes.put("/:id", asyncWrapper(itinController.updateItin));
itinRoutes.delete("/:id", asyncWrapper(itinController.deleteItin));

import express from "express";
import { knex } from "../app";
import { asyncWrapper } from "../utils/asyncWrapper";
import { LogisticsController } from "../controllers/LogisticsController";
import { LogisticsService } from "../services/LogisticsService";

const logisticsService = new LogisticsService(knex);
const logisticsController = new LogisticsController(logisticsService);

export const logisticsRoutes = express.Router();

logisticsRoutes.get("/list/:id", asyncWrapper(logisticsController.getLogisticsList));
logisticsRoutes.post("/item", asyncWrapper(logisticsController.addLogisticsItem));
logisticsRoutes.put("/item", asyncWrapper(logisticsController.updateLogisticsItem));
logisticsRoutes.put("/item/is-ready/:id", asyncWrapper(logisticsController.updateLogisticsItemIsReadyStatus));
logisticsRoutes.delete("/item/:id", asyncWrapper(logisticsController.deleteLogisticsItem));

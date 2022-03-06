import express from "express";
import { knex } from "../app";
import { EventController } from "../controllers/EventController";
import { EventService } from "../services/EventService";
import { asyncWrapper } from "../utils/asyncWrapper";

export const eventService = new EventService(knex);
const eventController = new EventController(eventService);

export const eventRoutes = express.Router();

eventRoutes.post("/", asyncWrapper(eventController.createEvent));
eventRoutes.post("/id", asyncWrapper(eventController.getEventByUserId));
eventRoutes.get("/list/:id", asyncWrapper(eventController.getEventListByUserId));
eventRoutes.get("/:userId/:eventId", asyncWrapper(eventController.getEventByUserIdAndEventId));

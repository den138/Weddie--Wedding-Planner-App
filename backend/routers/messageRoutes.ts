import express from "express";
import { knex } from "../app";
import { MessageController } from "../controllers/MessageController";
import { MessageService } from "../services/MessageService";
import { asyncWrapper } from "../utils/asyncWrapper";

const messageService = new MessageService(knex);
const messageController = new MessageController(messageService);

export const messageRoutes = express.Router();

messageRoutes.get("/list/all/:id", asyncWrapper(messageController.getAllMessageList));
messageRoutes.post("/", asyncWrapper(messageController.addMessage));
messageRoutes.get("/list/:eventId/:roleId", asyncWrapper(messageController.getMessageWithRole));

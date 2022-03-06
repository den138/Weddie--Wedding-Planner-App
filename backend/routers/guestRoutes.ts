import express from "express";
import { knex } from "../app";
import { asyncWrapper } from "../utils/asyncWrapper";
import { GuestController } from "../controllers/GuestController";
import { GuestService } from "../services/GuestService";
// import { isLoggedIn } from "../utils/guards";

const guestService = new GuestService(knex);
const guestController = new GuestController(guestService);

export const guestRoutes = express.Router();

guestRoutes.get("/list/:id", asyncWrapper(guestController.getGuestList));
guestRoutes.post("/", asyncWrapper(guestController.addGuest));
guestRoutes.put("/", asyncWrapper(guestController.updateGuest));
guestRoutes.delete("/:id", asyncWrapper(guestController.deleteGuest));

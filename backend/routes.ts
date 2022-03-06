import express from "express";
import { budgetRoutes } from "./routers/budgetRoutes";
import { eventRoutes } from "./routers/eventRoutes";
import { guestRoutes } from "./routers/guestRoutes";
import { logisticsRoutes } from "./routers/logisticsRoutes";
import { todoRoutes } from "./routers/todoRoutes";
import { itinRoutes } from "./routers/itinRoutes";
import { userRoutes } from "./routers/userRoutes";
import { isLoggedIn } from "./utils/guards";
import { messageRoutes } from "./routers/messageRoutes";
import { partiRoutes } from "./routers/partiRoutes";

export const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/events", eventRoutes);
routes.use("/logistics", logisticsRoutes);
routes.use("/guest", guestRoutes);
routes.use("/budget", budgetRoutes);
routes.use("/todo", todoRoutes);
routes.use("/itin", isLoggedIn, itinRoutes);
routes.use("/event", eventRoutes);
routes.use("/message", messageRoutes);
routes.use("/parti", partiRoutes);

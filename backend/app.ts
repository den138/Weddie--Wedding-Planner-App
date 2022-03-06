import Knex from "knex";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import knexConfig from "./knexfile";
export const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);
import { connectToMongo } from "./mongoConnection";
import express from "express";
import { logger } from "./utils/logger";

async function connectMongo() {
  try {
    await connectToMongo();
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit();
  }
}

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const cur = new Date().toISOString();
  logger.info(`${cur} req path: ${req.path} method: ${req.method}`);
  res.setHeader("app-version", "1.2.3");
  next();
});

connectMongo();
import { routes } from "./routes";
const API_VERSION = "/api";
app.use(API_VERSION, routes);

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  logger.info(`[info] listening to port ${PORT}`);
});

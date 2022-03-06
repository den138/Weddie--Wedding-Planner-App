import express from "express";
import { knex } from "../app";
import { BudgetController } from "../controllers/BudgetController";
import { BudgetService } from "../services/BudgetService";
import { asyncWrapper } from "../utils/asyncWrapper";

const budgetService = new BudgetService(knex);
const budgetController = new BudgetController(budgetService);

export const budgetRoutes = express.Router();

budgetRoutes.get("/list/:id", asyncWrapper(budgetController.getExpenditureList));
budgetRoutes.post("/item", asyncWrapper(budgetController.addExpenditureList));
budgetRoutes.put("/item", asyncWrapper(budgetController.updateExpenditureList));
budgetRoutes.delete("/item/:id", asyncWrapper(budgetController.deleteExpenditureList));
budgetRoutes.post("/testupdate", asyncWrapper(budgetController.updateExpenditureList));
budgetRoutes.delete("/testdelete", asyncWrapper(budgetController.deleteExpenditureList));
budgetRoutes.post("/testadd", asyncWrapper(budgetController.addExpenditureList));

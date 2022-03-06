import { Request, Response } from "express";
import { logger } from "../utils/logger";

export const asyncWrapper = (fn: any) => async (req: Request, res: Response) => {
  try {
    await fn(req, res);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "侗服器發生錯誤，請稍後重試。" });
  }
};

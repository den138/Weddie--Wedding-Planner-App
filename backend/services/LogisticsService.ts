import { Knex } from "knex";
import { tables } from "../utils/tables";
import { LogisticsItem } from "./models";

export class LogisticsService {
  constructor(private knex: Knex) {}

  getLogisticsList = async (eventID: number) => {
    const logisticsList = await this.knex
      .select("*")
      .from(tables.WEDDING_LOGISTICS)
      .where("wedding_event_id", eventID)
      .orderBy("id");

    return logisticsList;
  };

  addLogisticsItem = async (logisticsItem: LogisticsItem) => {
    await this.knex(tables.WEDDING_LOGISTICS).insert(logisticsItem);
    return;
  };

  updateLogisticsItem = async (logisticsItem: LogisticsItem, itemId: number) => {
    await this.knex(tables.WEDDING_LOGISTICS).update(logisticsItem).where("id", itemId);
    return;
  };

  deleteLogisticsItem = async (itemId: number) => {
    await this.knex(tables.WEDDING_LOGISTICS).where("id", itemId).del();
    return;
  };

  updateLogisticsItemIsReadyStatus = async (isReady: boolean, itemId: number) => {
    await this.knex(tables.WEDDING_LOGISTICS).update("is_ready", isReady).where("id", itemId);
  };
}

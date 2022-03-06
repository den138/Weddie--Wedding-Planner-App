import { Chance } from "chance";
import { budget_range_template } from "./budget_range";
// import { all_banquet_vendor } from "./dataset/all_banquet_vendor";
import {
  newBudgetTemplate,
  randomDate,
  banquetBudgetMap,
} from "../00-init-data";
const chance = new Chance();

interface updateReqBody {
  budgetListId: number;
  description: string;
  expenditure: number;
  amendDate: number;
}
import Knex from "knex";
import knexConfig from "../../knexfile";

const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

interface budgetListIdInfo {
  id: number;
  wedding_event_id: number;
  budget_cat_id: number;
  budget_description_id: number;
  description: string;
  expenditure: number;
}

async function getBudgetInfo(budgetListId: number) {
  const result = await knex("wedding_budget_list")
    .select()
    .where("id", budgetListId)
    .first();
  return result;
}

async function getWeddingInfo(weddingEventId: number) {
  const result = await knex("wedding_event")
    .select()
    .where("wedding_event.id", weddingEventId)
    .join(
      "banquet_vendor_list",
      "wedding_event.banquet_vendor_id",
      "banquet_vendor_list.id"
    )
    .first();
  return result;
}

export async function furtherInit() {
  let furtherUpdateArr = [] as any;
  const trx = await knex.transaction();

  try {
    for (let i = 0; i < Math.floor(newBudgetTemplate.length * 0.2); i++) {
      let obj = {} as updateReqBody;
      const budgetListId = chance.integer({
        min: 1,
        max: newBudgetTemplate.length,
      });
      const budgetListInfo: budgetListIdInfo = await getBudgetInfo(
        budgetListId
      );
      const weddingInfo = await getWeddingInfo(budgetListInfo.wedding_event_id);

      obj.budgetListId = budgetListId;
      obj.description = budgetListInfo.description;
      obj.amendDate = Date.parse(
        randomDate(
          weddingInfo.created_at,
          weddingInfo.wedding_date
        ).toUTCString()
      );
      obj.expenditure = chance.integer({
        min:
          budgetListInfo.description === "酒席"
            ? banquetBudgetMap.get(weddingInfo.banquet_cat_id).min
            : budget_range_template[budgetListInfo.budget_description_id - 1]
                .budget_range_min,
        max:
          budgetListInfo.description === "酒席"
            ? banquetBudgetMap.get(weddingInfo.banquet_cat_id).max
            : budget_range_template[budgetListInfo.budget_description_id - 1]
                .budget_range_max,
      });
      furtherUpdateArr.push(obj);
    }
  } catch (err) {
    console.error(err.message);
    await trx.rollback();
  } finally {
    await trx.destroy();
  }
  return furtherUpdateArr;
}

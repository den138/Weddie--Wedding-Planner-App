import { Knex } from "knex";
import { tables } from "../../backend/utils/tables";

import { Chance } from "chance";
import { budget_range_template } from "./dataset/budget_range";
import { all_banquet_vendor } from "./dataset/all_banquet_vendor";
const chance = new Chance();

export const banquetBudgetMap = new Map();
banquetBudgetMap.set(1, { min: 144917 * 0.9, max: 144917 * 1.2 });
banquetBudgetMap.set(2, { min: 103880, max: 136560 });
banquetBudgetMap.set(3, { min: 68880, max: 110000 });
banquetBudgetMap.set(4, { min: 70560, max: 138000 });

export function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

let userNum = 20;
let userList: any = [];
for (let i = 0; i < userNum; i++) {
  userList[i] = {
    nickname: chance.name(),
    email: chance.email({ domain: "tecky.io" }),
    password: chance.hash({ length: 25 }),
    phone: chance.integer({ min: 20000000, max: 99999999 }),
    district_id: chance.integer({ min: 1, max: 18 }),
    gender: Math.random() > 0.5 ? "M" : "F",
  };
}

let totalWeddingEventNum = 30;
let weddingEventList: any = [];
export let newBudgetTemplate: any = [];
export let bodyArr: any = [];

for (let i = 0; i < totalWeddingEventNum; i++) {
  weddingEventList[i] = {
    wedding_name: `${chance.word()}&${chance.word()}`,
    wedding_date: randomDate(
      new Date(2022, 9, 1),
      new Date(2023, 12, 10)
    ).toUTCString(),
    pax: chance.integer({ min: 100, max: 300 }),
    budget: chance.integer({ min: 280000, max: 400000 }),
    banquet_vendor_id: chance.integer({
      min: 1,
      max: all_banquet_vendor.length - 1,
    }),
    church_id: chance.integer({ min: 1, max: 267 }),
    created_at: randomDate(new Date(2022, 1, 1), new Date(2022, 2, 28)),
  };

  for (let item of budget_range_template) {
    let withoutExpObj = {} as any;
    withoutExpObj.wedding_event_id = i + 1;
    withoutExpObj.budget_cat_id = item.budget_cat_id_temp;
    withoutExpObj.budget_description_id =
      budget_range_template.indexOf(item) + 1;
    withoutExpObj.description = item.budget_description_temp;
    newBudgetTemplate.push(withoutExpObj);

    let bodyObj = {} as any;
    bodyObj.budgetListId =
      withoutExpObj.budget_description_id + budget_range_template.length * i;
    bodyObj.description = item.budget_description_temp;
    bodyObj.expenditure = chance.integer({
      min:
        item.budget_range_min === 0
          ? banquetBudgetMap.get(
              all_banquet_vendor[weddingEventList[i].banquet_vendor_id - 1]
                .banquet_cat_id
            ).min
          : item.budget_range_min,
      max:
        item.budget_range_max === 0
          ? banquetBudgetMap.get(
              all_banquet_vendor[weddingEventList[i].banquet_vendor_id - 1]
                .banquet_cat_id
            ).max
          : item.budget_range_max,
    });
    bodyObj.amendDate = +new Date();
    bodyArr.push(bodyObj);
  }
}

let weddingUserList: any = [];
for (let i = 0; i < 30; i++) {
  weddingUserList[i] = {
    wedding_event_id: chance.integer({ min: 1, max: totalWeddingEventNum }),
    user_id: chance.integer({ min: 1, max: userNum }),
    role_id: chance.integer({ min: 1, max: 9 }),
  };
}

export async function seed(knex: Knex): Promise<void> {
  const trx = await knex.transaction();
  try {
    await knex.raw("TRUNCATE user_info RESTART IDENTITY CASCADE");
    await knex.raw("TRUNCATE wedding_event RESTART IDENTITY CASCADE");
    await knex.raw("TRUNCATE wedding_budget_list RESTART IDENTITY CASCADE");
    await knex.raw("TRUNCATE wedding_user RESTART IDENTITY CASCADE");

    await knex(tables.USER_INFO).insert(userList);
    await knex(tables.WEDDING_EVENT).insert(weddingEventList);
    await knex(tables.WEDDING_USER).insert(weddingUserList);
    await knex(tables.WEDDING_BUDGET_LIST).insert(newBudgetTemplate);
    await knex(tables.WEDDING_GUEST_LIST).insert([
      {
        wedding_event_id: 1,
        name: "Billy",
        phone: "97343865",
        relationship: "Bro",
      },
    ]);

    await trx.commit();
  } catch (err) {
    console.error(err.message);
    await trx.rollback();
  } finally {
    await trx.destroy();
  }
}

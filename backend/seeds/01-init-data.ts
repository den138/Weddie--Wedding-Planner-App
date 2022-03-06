import { Knex } from "knex";
import { church } from "./dataset/church";
import { club } from "./dataset/club_info";
import { hotel } from "./dataset/hotel_info";
import { restaurant } from "./dataset/restaurant_info";
import { others } from "./dataset/others_info";
import * as dataset from "./dataset/miscellaneous_seeds";
import { tables } from "../utils/tables";
import { itin_template } from "./dataset/template/itin_template";
import { to_do_list_template } from "./dataset/template/to_do_list_template";
import { logistics_list_template } from "./dataset/template/logistics_list_template";
import { budget_template } from "./dataset/template/budget_template";
import { hashPassword } from "../utils/hash";

export async function seed(knex: Knex): Promise<void> {
  const trx = await knex.transaction();
  try {
    await knex(tables.BANQUET_VENDOR_CAT).insert(dataset.banquet_cat);
    await knex(tables.BANQUET_VENDOR_LIST).insert(club);
    await knex(tables.BANQUET_VENDOR_LIST).insert(hotel);
    await knex(tables.BANQUET_VENDOR_LIST).insert(restaurant);
    await knex(tables.BANQUET_VENDOR_LIST).insert(others);
    await knex(tables.CHURCH_LIST).insert(church);
    await knex(tables.BUDGET_CAT).insert(dataset.budget_cat);
    await knex(tables.HK_DISTRICT).insert(dataset.hk_district);
    await knex(tables.ROLE).insert(dataset.role);
    await knex(tables.USER_INFO).insert([
      {
        nickname: "Den",
        email: "Den@gmail.com",
        password: await hashPassword("12345678"),
        phone: "55555555",
        district_id: "12",
        gender: "M",
      },
    ]);
    await knex(tables.ITIN_TEMPLATE).insert(itin_template);
    await knex(tables.TO_DO_LIST_TEMPLATE).insert(to_do_list_template);
    await knex(tables.LOGISTICS_LIST_TEMPLATE).insert(logistics_list_template);
    await knex(tables.BUDGET_TEMPLATE).insert(budget_template);

    await trx.commit();
  } catch (err) {
    console.error(err.message);
    await trx.rollback();
  } finally {
    await trx.destroy();
  }
}

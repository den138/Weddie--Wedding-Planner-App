import { Knex } from "knex";
import { tables } from "../utils/tables";
import { collections } from "../mongoConnection";
import { EventStore, EventType } from "./models";
// import { budget_template } from "../seeds/dataset/template/budget_template";

interface BudgetItem {
  id?: number;
  wedding_event_id: number;
  budget_cat_id: number;
  description?: string;
  expenditure: number;
  payment_date?: Date;
}

export class BudgetService {
  constructor(private knex: Knex) {}

  getExpenditureList = async (eventId: number) => {
    const expenditureList = await this.knex
      .select("*")
      .from(tables.WEDDING_BUDGET_LIST)
      .where("wedding_event_id", eventId)
      .orderBy("id");

    return expenditureList;
  };

  addBudgetItem = async (budgetItem: BudgetItem) => {
    await this.knex(tables.WEDDING_BUDGET_LIST).insert(budgetItem);

    return;
  };

  updateBudgetItem = async (budgetItem: BudgetItem, itemId: number) => {
    await this.knex(tables.WEDDING_BUDGET_LIST).update(budgetItem).where("id", itemId);
    return;
  };

  deleteBudgetItem = async (itemId: number) => {
    await this.knex(tables.WEDDING_BUDGET_LIST).where("id", itemId).del();
    return;
  };

  updateExpenditureList = async (budgetListId: number, description: string, expenditure: number, amendDate: number) => {
    const weddingEventId = (await this.knex(tables.WEDDING_BUDGET_LIST).select().where("id", budgetListId).first())
      .wedding_event_id;

    const weddingEventInfo = await this.knex(tables.WEDDING_EVENT).select().where("id", weddingEventId).first();
    const weddingCreatedAtDate = weddingEventInfo.created_at.getTime();
    const weddingDate = weddingEventInfo.wedding_date.getTime();

    const old_budget_data = await this.knex(tables.WEDDING_BUDGET_LIST)
      .select()
      .where(`${tables.WEDDING_BUDGET_LIST}.id`, budgetListId)
      .join(tables.BUDGET_CAT, `${tables.WEDDING_BUDGET_LIST}.budget_cat_id`, `${tables.BUDGET_CAT}.id`)
      .orderBy("updated_at", "desc")
      .first();

    let event_store_old = {} as EventStore;
    event_store_old.eventType = EventType.Delete;
    event_store_old.data = old_budget_data;
    event_store_old.amendDate = amendDate;
    event_store_old.weddingCreatedAtDate = weddingCreatedAtDate;
    event_store_old.weddingDate = weddingDate;

    await this.knex(tables.WEDDING_BUDGET_LIST)
      .where("id", budgetListId)
      .update({ description: description, expenditure: expenditure, updated_at: new Date(amendDate).toISOString() });

    const new_budget_data = await this.knex(tables.WEDDING_BUDGET_LIST)
      .select()
      .where(`${tables.WEDDING_BUDGET_LIST}.id`, budgetListId)
      .join(tables.BUDGET_CAT, `${tables.WEDDING_BUDGET_LIST}.budget_cat_id`, `${tables.BUDGET_CAT}.id`)
      .first();

    let event_store_new = { ...event_store_old } as EventStore;
    event_store_new.amendDate = amendDate;
    event_store_new.eventType = EventType.Add;
    event_store_new.data = new_budget_data;

    let insertArr = [event_store_old, event_store_new];

    try {
      await collections.event_store?.insertMany(insertArr);
    } catch (e) {
      console.log(e);
      process.exit();
    }

    return;
  };

  deleteExpenditureList = async (budgetListId: number, amendDate: number) => {
    const weddingEventId = (await this.knex(tables.WEDDING_BUDGET_LIST).select().where("id", budgetListId).first())
      .wedding_event_id;

    const weddingEvent = await this.knex(tables.WEDDING_EVENT).select().where("id", weddingEventId).first();
    const weddingCreatedAtDate = weddingEvent.created_at.getTime();
    const weddingDate = weddingEvent.wedding_date.getTime();

    const deletedItem = await this.knex(tables.WEDDING_BUDGET_LIST)
      .select()
      .where(`${tables.WEDDING_BUDGET_LIST}.id`, budgetListId)
      .join(tables.BUDGET_CAT, `${tables.WEDDING_BUDGET_LIST}.budget_cat_id`, `${tables.BUDGET_CAT}.id`)
      .first();

    let deleteAction = {} as EventStore;
    deleteAction.eventType = EventType.Delete;
    deleteAction.data = deletedItem;
    deleteAction.amendDate = amendDate;
    deleteAction.weddingCreatedAtDate = weddingCreatedAtDate;
    deleteAction.weddingDate = weddingDate;

    await this.knex(tables.WEDDING_BUDGET_LIST).where(`${tables.WEDDING_BUDGET_LIST}.id`, budgetListId).del();

    try {
      await collections.event_store?.insertOne(deleteAction);
    } catch (e) {
      console.log(e);
      process.exit();
    }

    return;
  };

  addExpenditureList = async (budgetItem: any, amendDate: number) => {
    const currentRecordNum = (await this.knex(tables.WEDDING_BUDGET_LIST)
      .select()
      .where("wedding_event_id", budgetItem.wedding_event_id)
      .count()
      .first())!!.count; //string

    budgetItem.budget_description_id = Number(currentRecordNum) + 1;
    const addedItemId = await this.knex(tables.WEDDING_BUDGET_LIST).insert(budgetItem).returning("id");
    const addedItem = await this.knex(tables.WEDDING_BUDGET_LIST)
      .select()
      .where(`${tables.WEDDING_BUDGET_LIST}.id`, Number(addedItemId))
      .join(tables.BUDGET_CAT, `${tables.WEDDING_BUDGET_LIST}.budget_cat_id`, `${tables.BUDGET_CAT}.id`)
      .first();

    const weddingEvent = await this.knex(tables.WEDDING_EVENT)
      .select()
      .where("id", budgetItem.wedding_event_id)
      .first();
    const weddingCreatedAtDate = weddingEvent.created_at.getTime();
    const weddingDate = weddingEvent.wedding_date.getTime();

    let addAction = {} as EventStore;
    addAction.eventType = EventType.Add;
    addAction.data = addedItem;
    addAction.amendDate = amendDate;
    addAction.weddingCreatedAtDate = weddingCreatedAtDate;
    addAction.weddingDate = weddingDate;

    try {
      await collections.event_store?.insertOne(addAction);
    } catch (e) {
      console.log(e);
      process.exit();
    }
  };
}

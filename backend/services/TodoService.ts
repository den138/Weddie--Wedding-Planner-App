import { Knex } from "knex";
import { tables } from "../utils/tables";
import { TodoItem } from "./models";

export class TodoService {
  constructor(private knex: Knex) {}

  getTodoList = async (eventId: number) => {
    const todoList = this.knex
      .select("*")
      .from(tables.WEDDING_TO_DO_LIST)
      .where("wedding_event_id", eventId)
      .orderBy("to_do_date");

    return todoList;
  };

  addTodoItem = async (todoItemData: TodoItem) => {
    await this.knex(tables.WEDDING_TO_DO_LIST).insert(todoItemData);
    return;
  };

  updateTodoItem = async (todoItemData: TodoItem, itemId: number) => {
    await this.knex(tables.WEDDING_TO_DO_LIST).update(todoItemData).where("id", itemId);
    return;
  };

  deleteTodoItem = async (itemId: number) => {
    await this.knex(tables.WEDDING_TO_DO_LIST).where("id", itemId).del();
    return;
  };
}

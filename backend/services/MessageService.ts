import { Knex } from "knex";
import { tables } from "../utils/tables";
import { MessageList } from "./models";

export class MessageService {
  constructor(private knex: Knex) {}

  getAllMessageList = async (eventId: number) => {
    const messageList = await this.knex
      .select("*")
      .from(tables.MESSAGE_LIST)
      .innerJoin(tables.MESSAGE_ROLE, "message_role.message_id", "message_list.id")
      .where("wedding_event_id", eventId)
      .orderBy("created_at", "DESC")
      .limit(20);
    return messageList;
  };

  addMessage = async (messageData: MessageList, role_id_arr: number[]) => {
    const [messageId] = await this.knex(tables.MESSAGE_LIST).insert(messageData).returning("id");

    for (const roleId of role_id_arr) {
      await this.knex(tables.MESSAGE_ROLE).insert({
        message_id: messageId,
        role_id: roleId,
      });
    }
  };

  getMessageWithRole = async (eventId: number, roleId: number) => {
    const messageList = await this.knex(tables.MESSAGE_LIST)
      .innerJoin(tables.MESSAGE_ROLE, "message_role.message_id", "message_list.id")
      .where({
        "message_list.wedding_event_id": eventId,
        "message_role.role_id": roleId,
      });

    return messageList;
  };
}

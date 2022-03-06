import { Knex } from "knex";
import { tables } from "../utils/tables";
import { Parti } from "./models";

export class PartiService {
  constructor(private knex: Knex) {}

  getPartiList = async (eventId: number) => {
    const partiList: Parti[] = await this.knex
      .select("*")
      .from(tables.WEDDING_PARTI_LIST)
      .where("wedding_event_id", eventId)
      .orderBy("role_id");

    return partiList;
  };

  addParti = async (partiData: Parti) => {
    await this.knex<Parti>(tables.WEDDING_PARTI_LIST).insert(partiData);

    const [matchedPhone] = await this.knex(tables.USER_INFO).where("phone", partiData.phone)

    if (matchedPhone){
      await this.knex(tables.WEDDING_USER).insert({
        wedding_event_id: partiData.wedding_event_id,
        user_id: matchedPhone.id,
        role_id: partiData.role_id,
      })
    }

  };

  updateParti = async (partiData: Parti, partiId: number) => {

    await this.knex<Parti>(tables.WEDDING_PARTI_LIST).update(partiData).where("id", partiId);

    return;
  };

  deleteParti = async (partiId: number) => {
    const [partiData] = await this.knex(tables.WEDDING_PARTI_LIST).where("id", partiId).returning(['phone', 'wedding_event_id', 'role_id'])

    const [matchedPhone] = await this.knex(tables.USER_INFO).where("phone", partiData.phone)

    if (matchedPhone){
      await this.knex(tables.WEDDING_USER).where({
        wedding_event_id: partiData.wedding_event_id,
        user_id: matchedPhone.id,
        role_id: partiData.role_id,
      }).del()
    }

    await this.knex(tables.WEDDING_PARTI_LIST).where("id", partiId).del()

    return;
  };
}

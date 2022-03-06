import { Knex } from "knex";
import { tables } from "../utils/tables";
import { ItinList } from "./models";

export class ItinService {
  constructor(private knex: Knex) { }

  getItinList = async (eventID: number) => {

    const itinList = await this.knex.select(`${tables.ITINERARY_LIST}.id`, 'itinerary', 'job_duty', 'itinerary_time', `${tables.ITINERARY_ROLE}.role_id`).from(tables.ITINERARY_LIST)
      .where("wedding_event_id", eventID)
      .innerJoin(tables.ITINERARY_ROLE, `${tables.ITINERARY_LIST}.id`, `${tables.ITINERARY_ROLE}.itinerary_id`)

    // console.log(itinList)

    const itinMap = new Map()
    for (const item of itinList) {
      const { role_id, id, ...others } = item;
      if (!itinMap.has(id)) {
        itinMap.set(id, {
          id,
          ...others,
          role_id_arr: []
        })
      }
      itinMap.get(id).role_id_arr.push(role_id)
    }

    return itinMap;
  };

  getMyItinList = async (eventID: number, userId: number) => {

    const [role] = await this.knex.select('role_id').from(tables.WEDDING_USER).where({
      wedding_event_id: eventID,
      user_id: userId,
    })

    const itinList = await this.knex.select(`${tables.ITINERARY_LIST}.id`, 'itinerary', 'job_duty', 'itinerary_time', `${tables.ITINERARY_ROLE}.role_id`)
      .from(tables.ITINERARY_LIST)
      .distinctOn('id')
      .innerJoin(tables.ITINERARY_ROLE, `${tables.ITINERARY_LIST}.id`, `${tables.ITINERARY_ROLE}.itinerary_id`)
      .innerJoin(tables.WEDDING_USER, `${tables.WEDDING_USER}.role_id`, `${tables.ITINERARY_ROLE}.role_id`)
      .where(`${tables.ITINERARY_LIST}.wedding_event_id`, eventID)
      .where(`${tables.WEDDING_USER}.user_id`, userId)
      .where(`${tables.WEDDING_USER}.role_id`, role.role_id)

    return itinList;
  };

  async getEventId(userId: number) {
    const [eventId] = await this.knex.select("user_id").from(tables.WEDDING_USER).where("user_id", userId)
    return eventId;
  }

  async addItin(itinData: ItinList, role_id_arr: number[]) {
    const [itinId] = await this.knex(tables.ITINERARY_LIST).insert(itinData).returning('id')

    for (const role of role_id_arr) {
      await this.knex(tables.ITINERARY_ROLE).insert({
        itinerary_id: itinId,
        role_id: role,
      })
    }
  }

  async updateItin(itinData: ItinList, role_id_arr: number[], itinId: number) {
    await this.knex(tables.ITINERARY_LIST).update(itinData).where("id", itinId)
    await this.knex(tables.ITINERARY_ROLE).where("itinerary_id", itinId).del()
    console.log(role_id_arr)
    for (const role of role_id_arr) {
      console.log("hi")
      console.log(itinId)
      console.log(role)
      await this.knex(tables.ITINERARY_ROLE).insert({
        itinerary_id: itinId,
        role_id: role,
      })
    }

  }

  async deleteItin(itinId: number) {
    await this.knex(tables.ITINERARY_ROLE).where('itinerary_id', itinId).del()
    await this.knex(tables.ITINERARY_LIST).where('id', itinId).del()
  }

}

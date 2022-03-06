import { Knex } from "knex";
import { budget_template } from "../seeds/dataset/template/budget_template";
import { itin_template } from "../seeds/dataset/template/itin_template";
import { logistics_list_template } from "../seeds/dataset/template/logistics_list_template";
import { to_do_list_template } from "../seeds/dataset/template/to_do_list_template";
import { tables } from "../utils/tables";
import { IEvent } from "./models";

function getDate(wedding_date: string, days_prior_wedding: string) {
  const date = new Date(wedding_date);
  const days = parseInt(days_prior_wedding);
  const oneDay = 1000 * 60 * 60 * 24;
  const time = date.getTime() - oneDay * days;
  return new Date(time);
}

export class EventService {
  constructor(private knex: Knex) {}

  async createEvent(event: IEvent) {
    const { wedding_date, wedding_name, pax, budget, user_id, role_id } = event;

    const [eventId] = await this.knex(tables.WEDDING_EVENT)
      .insert({ wedding_date, wedding_name, pax, budget })
      .returning("id");

    await this.knex(tables.WEDDING_USER).insert({ user_id, role_id, wedding_event_id: eventId });

    const [userInfo] = await this.knex(tables.USER_INFO).where({id: user_id})

    await this.knex(tables.WEDDING_PARTI_LIST).insert({
      wedding_event_id: eventId,
      name: userInfo.nickname,
      phone: userInfo.phone,
      role_id,
    })

    const trx = await this.knex.transaction();

    try {
      for (let item of budget_template) {
        await trx(tables.WEDDING_BUDGET_LIST).insert({
          wedding_event_id: eventId,
          budget_cat_id: item.budget_cat_id_temp,
          description: item.budget_description_temp,
          budget_description_id: item.budget_description_id,
          expenditure: 0,
        });
      }

      for (let item of logistics_list_template) {
        await trx(tables.WEDDING_LOGISTICS).insert({
          wedding_event_id: eventId,
          logistics_item: item.logistics_item,
        });
      }

      for (let item of to_do_list_template) {
        await trx(tables.WEDDING_TO_DO_LIST).insert({
          wedding_event_id: eventId,
          to_do_date: getDate(wedding_date, item.days_prior_wedding),
          to_do_item: item.to_do_temp,
          to_do_remarks: "",
        });
      }

      let id_temp;

      for (let i = 0; i < itin_template.length; i++) {
        if (itin_template[i - 1] !== undefined) {
          if (itin_template[i].itin_temp === itin_template[i - 1].itin_temp) {
            await trx(tables.ITINERARY_ROLE).insert({
              itinerary_id: id_temp,
              role_id: itin_template[i].wedding_user_id_temp,
            });
            continue;
          }
        }

        const [itinerary_id] = await trx(tables.ITINERARY_LIST)
          .insert({
            wedding_event_id: eventId,
            itinerary: itin_template[i].itin_temp,
            job_duty: itin_template[i].job_duty_temp,
            itinerary_time: itin_template[i].itin_time_temp,
          })
          .returning("id");

        id_temp = itinerary_id;

        await trx(tables.ITINERARY_ROLE).insert({
          itinerary_id: itinerary_id,
          role_id: itin_template[i].wedding_user_id_temp,
        });
      }

      await trx.commit();
    } catch (e) {
      console.error(e);
      await trx.rollback();
    }

    return eventId;
  }

  async getEventByUserId(userId: number) {
    const eventData = await this.knex
      .from(tables.WEDDING_USER)
      .where({ user_id: userId })
      .innerJoin("wedding_event", "wedding_event_id", "wedding_event.id")
      .innerJoin("role", "role_id", "role.id")
      .orderBy('updated_at', 'desc')
      .first();

    return eventData;
  }

  async getEventByUserIdAndEventId(eventId: number, userId: number) {
    const eventData = await this.knex
      .from(tables.WEDDING_USER)
      .where({
        wedding_event_id: eventId,
        user_id: userId,
      })
      .innerJoin("wedding_event", "wedding_event_id", "wedding_event.id")
      .innerJoin("role", "role_id", "role.id")
      .orderBy('updated_at', 'desc')
      .first();

    return eventData;
  }

  async getEventListByUserId(userId: number) {
    const eventList = await this.knex(tables.WEDDING_USER)
      .select("wedding_event.wedding_name", "wedding_event.wedding_date", "wedding_event.id")
      .innerJoin(tables.WEDDING_EVENT, "wedding_event.id", "wedding_user.wedding_event_id")
      .where("wedding_user.user_id", userId);

    return eventList;
  }
}

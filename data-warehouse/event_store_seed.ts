import { connectToMongo, collections } from "../backend/mongoConnection";
import { budget_template } from "../backend/seeds/dataset/template/budget_template";
import { budget_cat } from "../backend/seeds/dataset/miscellaneous_seeds";
import { Chance } from "chance";
import { EventType, EventStore } from "../backend/services/models";

const chance = new Chance();

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const genAddEventStoreObj = (): EventStore => {
  const amendDate = Date.parse(
    randomDate(new Date(2022, 1, 1), new Date(2022, 12, 31)).toUTCString()
  );
  // const eventType = [EventType.Delete, EventType.Add];
  // const eventTypeNum = chance.integer({ min: 0, max: 1 });
  // const description_id = chance.integer({ min: 1, max: budget_template.length });
  const description_id = chance.integer({ min: 1, max: 2 });
  const budgetCatId = budget_template[description_id - 1].budget_cat_id_temp;
  const data = {
    description_id,
    description: budget_template[description_id - 1].budget_description_temp,
    budget_cat_id: Number(budgetCatId),
    budget_cat: budget_cat[Number(budgetCatId) - 1].budget_cat,
    expenditure: chance.integer({ min: 10000, max: 100000 }),
    wedding_event_id: 1,
  };
  return {
    data,
    eventType: EventType.Add,
    amendDate,
    weddingCreatedAtDate: Date.parse(new Date(2022, 1, 1).toUTCString()),
    weddingDate: Date.parse(new Date(2022, 12, 31).toUTCString()),
    recordCreatedAtDate: Date.parse(
      new Date(Date.parse(new Date().toUTCString())).toUTCString()
    ),
  };
};

// const genDeleteEventStoreObj = (): EventStore => {
//   let editArr = [];
//   const amendDate = Date.parse(
//     randomDate(new Date(2022, 1, 1), new Date(2022, 12, 31)).toUTCString()
//   );
//   const description_id = chance.integer({ min: 1, max: 2 });
//   const budgetCatId = budget_template[description_id - 1].budget_cat_id_temp;
//   const data = {
//     description_id,
//     description: budget_template[description_id - 1].budget_description_temp,
//     budget_cat_id: Number(budgetCatId),
//     budget_cat: budget_cat[Number(budgetCatId) - 1].budget_cat,
//     expenditure: chance.integer({ min: 10000, max: 100000 }),
//     wedding_event_id: 1,
//   };
//   return {
//     data,
//     eventType: EventType.Delete,
//     amendDate,
//     weddingCreatedAtDate: Date.parse(new Date(2022, 1, 1).toUTCString()),
//     weddingDate: Date.parse(new Date(2022, 12, 31).toUTCString()),
//     recordCreatedAtDate: Date.parse(
//       new Date(Date.parse(new Date().toUTCString())).toUTCString()
//     ),
//   };
// };

const genEditEventStoreObj = (): EventStore[] => {
  let a = genAddEventStoreObj();
  let b = { ...a };
  b.eventType = EventType.Delete;
  return [a, b];
};

let data: EventStore[] = [];
for (let i = 0; i < 2; i++) {
  const result = genEditEventStoreObj();
  data.push(...result);
}

async function insertSeedToMongo() {
  try {
    await connectToMongo();
    // await collections.event_store?.drop();
    await collections.event_store?.insertMany(
      Array.from({ length: 1 }, genAddEventStoreObj)
    );
    // await collections.event_store?.insertMany(
    //   Array.from({ length: 5 }, genDeleteEventStoreObj)
    // );
    await collections.event_store?.insertMany(data);
  } catch (err) {
    console.log("Database connection failed", err);
  } finally {
    process.exit();
  }
}

insertSeedToMongo();

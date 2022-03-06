import fetch from "node-fetch";
import { bodyArr } from "./seeds/00-init-data";
import { furtherInit } from "./seeds/dataset/01-further_init";
// import { EventType } from "../backend/services/models";
// import { budget_template } from "../backend/seeds/dataset/template/budget_template";
// import { budget_cat } from "../backend/seeds/dataset/miscellaneous_seeds";

const BASE_URL = "http://localhost:8080/api";

async function triggerUpdate(item: any) {
  await fetch(`${BASE_URL}/budget/testupdate`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

async function initFirstAndFurtherData() {
  for (let item of bodyArr) {
    await triggerUpdate(item);
  }

  const results = await furtherInit();

  for (let item of results) {
    await triggerUpdate(item);
  }
}

initFirstAndFurtherData();

// function randomDate(start: Date, end: Date) {
//   return new Date(
//     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//   );
// }

// function getRandomArbitrary(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }

// const genDeleteEventStoreObj = () => {
//   let editArr = [];
//   const amendDate = Date.parse(
//     randomDate(new Date(2022, 1, 1), new Date(2022, 12, 31)).toUTCString()
//   );
//   const description_id = Math.floor(Math.random() * budget_template.length) + 1;
//   const budgetCatId = budget_template[description_id - 1].budget_cat_id_temp;
//   const data = {
//     description_id,
//     description: budget_template[description_id - 1].budget_description_temp,
//     budget_cat_id: Number(budgetCatId),
//     budget_cat: budget_cat[Number(budgetCatId) - 1].budget_cat,
//     expenditure: getRandomArbitrary(10000, 100000),
//     wedding_event_id: 1,
//   };
//   return {
//     data,
//     eventType: EventType.Delete,
//     amendDate,
//     weddingCreatedAtDate: Date.parse(new Date(2022, 1, 1).toUTCString()),
//     weddingDate: Date.parse(new Date(2022, 12, 31).toUTCString()),
//   };
// };

// const result = await res.json();
// console.log(result);

// const triggerOnce = {
//   budgetListId: 2,
//   description: "test trigger update 2",
//   expenditure: 13579,
//   amendDate: +new Date(),
// };

// triggerUpdate(triggerOnce);

// async function triggerDelete() {
//   const res = await fetch(`${BASE_URL}/budget/testdelete`, {
//     method: "DELETE",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify({
//       budgetListId: 122,
//       amendDate: +new Date(),
//     }),
//   });

//   const result = await res.json();
//   console.log(result);
// }
// triggerDelete();

// async function triggerAdd() {
//   const res = await fetch(`${BASE_URL}/budget/testadd`, {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify({
//       wedding_event_id: 4,
//       description: "budget_description_id increment ",
//       expenditure: 12345,
//       budget_cat_id: 6,
//       amendDate: +new Date(),
//     }),
//   });

//   const result = await res.json();
//   console.log(result);
// }
// triggerAdd();

// async function triggerGetList() {
//   const res = await fetch(`${BASE_URL}/budget/list`);

//   const result = await res.json();
//   console.log(result);
// }
// triggerGetList();

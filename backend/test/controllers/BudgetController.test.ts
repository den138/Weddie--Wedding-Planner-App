import { BudgetController } from "../../controllers/BudgetController";
import { BudgetService } from "../../services/BudgetService";
import { Request, Response } from "express";
import { Knex } from "knex";

jest.mock("../../services/BudgetService.ts");

describe("BudgetController", () => {
  let controller: BudgetController;
  let service: BudgetService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new BudgetService({} as Knex);
    service.getExpenditureList = jest.fn(() => Promise.resolve([{ a: 1 }, { b: 2 }] as any));

    req = {
      params: {
        id: 5,
      } as any,
    } as Request;

    res = {
      json: jest.fn(),
    } as any as Response;

    controller = new BudgetController(service);
  });

  it("test get budget list success", async () => {
    await controller.getExpenditureList(req, res);

    expect(service.getExpenditureList).toBeCalledWith(5);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ expenditureList: [{ a: 1 }, { b: 2 }] });
  });
});

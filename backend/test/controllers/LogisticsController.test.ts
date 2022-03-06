import { LogisticsController } from "../../controllers/LogisticsController";
import { LogisticsService } from "../../services/LogisticsService";
import { Request, Response } from "express";
import { Knex } from "knex";

jest.mock("../../services/LogisticsService.ts");

describe("LogisticsController", () => {
  let controller: LogisticsController;
  let service: LogisticsService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new LogisticsService({} as Knex);
    service.getLogisticsList = jest.fn(() => Promise.resolve([{ a: 1 }, { b: 2 }] as any));

    req = {
      params: {
        id: 5,
      } as any,
    } as Request;

    res = {
      json: jest.fn(),
    } as any as Response;

    controller = new LogisticsController(service);
  });

  it("test get logistics list success", async () => {
    await controller.getLogisticsList(req, res);

    expect(service.getLogisticsList).toBeCalledWith(5);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ logisticsList: [{ a: 1 }, { b: 2 }] });
  });
});

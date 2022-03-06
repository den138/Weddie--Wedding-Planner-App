import { GuestController } from "../../controllers/GuestController";
import { GuestService } from "../../services/GuestService";
import { Request, Response } from "express";
import { Knex } from "knex";

jest.mock("../../services/GuestService.ts");

describe("GuestController", () => {
  let controller: GuestController;
  let service: GuestService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new GuestService({} as Knex);
    service.getGuestList = jest.fn(() => Promise.resolve([{ a: 1 }, { b: 2 }] as any));

    req = {
      params: {
        id: 5,
      } as any,
    } as Request;

    res = {
      json: jest.fn(),
    } as any as Response;

    controller = new GuestController(service);
  });

  it("test get guest list success", async () => {
    await controller.getGuestList(req, res);

    expect(service.getGuestList).toBeCalledWith(5);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ guestList: [{ a: 1 }, { b: 2 }] });
  });
});

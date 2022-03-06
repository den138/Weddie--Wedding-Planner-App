import { TodoController } from "../../controllers/TodoController";
import { TodoService } from "../../services/TodoService";
import { Request, Response } from "express";
import { Knex } from "knex";

jest.mock("../../services/TodoService.ts");

describe("TodoController", () => {
  let controller: TodoController;
  let service: TodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new TodoService({} as Knex);
    service.getTodoList = jest.fn(() => Promise.resolve([{ a: 1 }, { b: 2 }] as any));

    req = {
      params: {
        id: 5,
      } as any,
    } as Request;

    res = {
      json: jest.fn(),
    } as any as Response;

    controller = new TodoController(service);
  });

  it("test get todo list success", async () => {
    await controller.getTodoList(req, res);

    expect(service.getTodoList).toBeCalledWith(5);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ todoList: [{ a: 1 }, { b: 2 }] });
  });
});

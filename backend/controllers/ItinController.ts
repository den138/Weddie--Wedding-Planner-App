import { ItinService } from "../services/ItinService";
import { Request, Response } from "express";

export class ItinController {
  constructor(private itinService: ItinService) {}

  getItinList = async (req: Request, res: Response) => {
    const userId = req.user;

    const eventId = parseInt(req.params.id);

    if (!userId) {
      res.status(400).json({ message: "User not found" });
    }

    const itinMap = await this.itinService.getItinList(eventId);

    res.json(Array.from(itinMap.values()));
  };

  getMyItinList = async (req: Request, res: Response) => {
    const user = req.user;

    const eventId = parseInt(req.params.id);

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    const itinList = await this.itinService.getMyItinList(eventId, user!!.id);

    res.json(itinList);
  };

  addItin = async (req: Request, res: Response) => {
    const { role_id_arr, ...itinData } = req.body;

    await this.itinService.addItin(itinData, role_id_arr);

    res.json({ message: "add success" });
  };

  updateItin = async (req: Request, res: Response) => {
    const { role_id_arr, id, ...itinData } = req.body;

    await this.itinService.updateItin(itinData, role_id_arr, parseInt(req.params.id));

    res.json({ message: "update success " });
  };

  deleteItin = async (req: Request, res: Response) => {
    await this.itinService.deleteItin(parseInt(req.params.id));

    res.json({ message: "delete success" });
  };
}

import { Request, Response } from "express";
import { PartiService } from "../services/PartiService";

export class PartiController {
  constructor(private partiService: PartiService) {}

  getPartiList = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    const partiList = await this.partiService.getPartiList(eventId);

    res.json({ partiList });
  };

  addParti = async (req: Request, res: Response) => {
    const partiData = req.body;

    await this.partiService.addParti(partiData);

    res.json({ message: "successful add" });
  };

  updateParti = async (req: Request, res: Response) => {
    const { partiId, ...partiData } = req.body;

    await this.partiService.updateParti(partiData, partiId);

    res.json({ message: "successful update" });
  };

  deleteParti = async (req: Request, res: Response) => {
    const partiId = parseInt(req.params.id);

    await this.partiService.deleteParti(partiId);

    res.json({ message: "successful delete" });
  };
}

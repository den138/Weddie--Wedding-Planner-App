import { GuestService } from "../services/GuestService";
import { Request, Response } from "express";

export class GuestController {
  constructor(private guestService: GuestService) {}

  getGuestList = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    const guestList = await this.guestService.getGuestList(eventId);

    res.json({ guestList });
  };

  addGuest = async (req: Request, res: Response) => {
    const guestData = req.body;

    await this.guestService.addGuest(guestData);

    res.json({ message: "successful add" });
  };

  updateGuest = async (req: Request, res: Response) => {
    const { guestId, ...guestData } = req.body;

    await this.guestService.updateGuest(guestData, guestId);

    res.json({ message: "successful update" });
  };

  deleteGuest = async (req: Request, res: Response) => {
    const guestId = parseInt(req.params.id);

    await this.guestService.deleteGuest(guestId);

    res.json({ message: "successful delete" });
  };
}

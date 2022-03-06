import { Request, Response } from "express";
import { EventService } from "../services/EventService";

export class EventController {
  constructor(private eventService: EventService) {}

  createEvent = async (req: Request, res: Response) => {

    if (!req.body) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    const { eventName, role, bigday, budget, pax, user_id } = req.body;

    const event = {
      wedding_name: eventName,
      wedding_date: bigday,
      budget,
      pax,
      user_id: user_id,
      role_id: parseInt(role),
    };

    await this.eventService.createEvent(event);

    const eventData = await this.eventService.getEventByUserId(user_id);

    res.json(eventData);
  };

  getEventByUserId = async (req: Request, res: Response) => {

    const userId = req.body.userId;

    if (!req.body) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    const eventData = await this.eventService.getEventByUserId(userId);

    if (!eventData) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    res.json(eventData);
  };

  getEventListByUserId = async (req: Request, res: Response) => {

    const userId = parseInt(req.params.id);

    if (!req.params.id) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    const eventList = await this.eventService.getEventListByUserId(userId);

    res.json({ eventList });
  };

  getEventByUserIdAndEventId = async (req: Request, res: Response) => {

    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);

    if (!eventId){
      res.status(401).json({ msg: "Request are null" })
      return;
    }

    const eventData = await this.eventService.getEventByUserIdAndEventId(eventId, userId)

    if (!eventData) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    res.json(eventData)
  }


}

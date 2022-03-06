import { MessageService } from "../services/MessageService";
import { Request, Response } from "express";

export class MessageController {
  constructor(private messageService: MessageService) {}

  getAllMessageList = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);

    const messageList = await this.messageService.getAllMessageList(eventId);

    res.json({ messageList });
  };

  addMessage = async (req: Request, res: Response) => {
    const { role_id_arr, ...messageData } = req.body;

    await this.messageService.addMessage(messageData, role_id_arr);

    res.json({ message: "add success" });
  };

  getMessageWithRole = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.eventId);
    const roleId = parseInt(req.params.roleId);

    const messageList = await this.messageService.getMessageWithRole(eventId, roleId);

    res.json({ messageList });
  };
}

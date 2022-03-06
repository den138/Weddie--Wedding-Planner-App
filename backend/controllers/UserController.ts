import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import jwtSimple from "jwt-simple";
import jwt from "../utils/jwt";
import { checkPassword, hashPassword } from "../utils/hash";
export class UserController {
  constructor(private userService: UserService) {}

  getUserByToken = async (req: Request, res: Response) => {
    let userData;
    if (req.user) {
      userData = {
        id: req.user.id,
        nickname: req.user.nickname,
        email: req.user.email,
        phone: req.user.phone,
      };
    }
    res.json({ userData, message: "restore login success" });
  };

  login = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
      res.status(401).json({ msg: "電郵或密碼不能為空" });
      return;
    }

    const { email, password } = req.body;
    const user = await this.userService.getUserByEmail(email);

    if (!user || !(await checkPassword(password, user.password))) {
      res.status(401).json({ msg: "電郵或密碼錯誤" });
      return;
    }

    const payload = { id: user.id };
    const token = jwtSimple.encode(payload, jwt.jwtSecret);

    const userData = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
    };

    res.json({ token, userData });
  };

  signup = async (req: Request, res: Response) => {

    if (!req.body) {
      res.status(401).json({ msg: "Request are null" });
      return;
    }

    const { email, password, nickname, phone, gender, districtId } = req.body;

    const user = {
      email,
      password: await hashPassword(password),
      nickname,
      phone,
      gender,
      district_id: districtId,
    };

    if (password.length < 8) {
      res.status(400).json({ message: "密碼必須為八位字符" });
      return;
    }

    const existEmail = await this.userService.getUserByEmail(email);

    if (existEmail) {
      res.status(400).json({ message: "此電郵已被使用" });
      return;
    }

    const existPhone = await this.userService.getUserByPhone(phone);

    if (existPhone) {
      res.status(400).json({ message: "此電話號碼已被使用" });
      return;
    }

    const [newUserId] = await this.userService.insertNewUser(user);
    const payload = { id: newUserId };

    const token = jwtSimple.encode(payload, jwt.jwtSecret);

    const userData = {
      id: newUserId,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
    };

    res.json({ token, userData });
  };

  getUserById = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const settingData = await this.userService.getUserById(userId);

    res.json({ settingData });
  };
}

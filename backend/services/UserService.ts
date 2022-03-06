import { Knex } from "knex";
import { tables } from "../utils/tables";
import { SignupUser, User } from "./models";
// import { tables } from "../utils/tables";


export class UserService {
  constructor(private knex: Knex) {}

  async getUserByEmail(email: string) {
    const user = await this.knex<User>(tables.USER_INFO).where({ email: email }).first()
    return user;
  }

  async getUserByPhone(phone: string) {
    const user = await this.knex<User>(tables.USER_INFO).where({ phone: phone }).first()
    return user;
  }

  async getUserById(id: number) {
    const user = await this.knex<User>(tables.USER_INFO).where({ id }).first();
    return user;
  }

  async insertNewUser(newUser: SignupUser) {
    
    const [newUserID] = await this.knex(tables.USER_INFO).insert(newUser).returning("id");

    const matchedPhone = await this.knex(tables.WEDDING_PARTI_LIST).where({ phone: newUser.phone })

    if (matchedPhone){
      for (let matches of matchedPhone) {
        await this.knex(tables.WEDDING_USER).insert({
          wedding_event_id: matches.wedding_event_id,
          user_id: newUserID,
          role_id: matches.role_id,
        })
      }
    }

    return [newUserID];

  };

}

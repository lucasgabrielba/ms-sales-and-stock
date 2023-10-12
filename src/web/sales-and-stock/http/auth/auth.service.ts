import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AuthService {

  async getUser(id: string): Promise<any> {
    const response = await axios.get(`/user/${id}`);
    const user = response.data;

    if (!user) {
      return null;
    }

    return user;
  }


}
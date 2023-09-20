import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  profile_img?: string;
  usage: any;
}

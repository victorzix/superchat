import {IUser} from "@/features/auth/interfaces/user";

export interface IChat {
  id: string;
  isGroup: boolean;
  members: IUser[];
  createdAt: Date;
  updatedAt: Date;
}
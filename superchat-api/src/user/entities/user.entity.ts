export class User {
  id: string;
  phone: string;
  password: string;
  name: string;
  profilePicture?: string;
  isActive: boolean;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

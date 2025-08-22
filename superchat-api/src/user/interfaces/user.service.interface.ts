import { User } from '../entities/user.entity';
import { RegisterUserResponseDto } from '@/user/dto/responses/register-user-response.dto';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { Response } from 'express';

export interface IUserService {
  register: (dto: RegisterUserDto) => Promise<RegisterUserResponseDto>;
  update: () => Promise<User>;
  delete: () => Promise<void>;
  getData: (id: string) => Promise<RegisterUserResponseDto>;
  login: (res: Response, dto: LoginPayloadDto) => Promise<void>;
  refresh: (res: Response, refreshToken: string) => Promise<void>;
}

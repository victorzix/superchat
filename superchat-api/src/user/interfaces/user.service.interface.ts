import { User } from '../entities/user.entity';
import { RegisterUserResponseDto } from '@/user/dto/responses/register-user-response.dto';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { Response } from 'express';
import { RegisterUserRequestDto } from '@/user/dto/request/register-user-request.dto';
import { Socket } from 'socket.io';

export interface IUserService {
  register: (
    res: Response,
    dto: RegisterUserRequestDto,
    file?: Express.Multer.File,
  ) => Promise<RegisterUserResponseDto>;
  update: () => Promise<User>;
  delete: () => Promise<void>;
  getData: ({
    id,
    phone,
  }: {
    id?: string;
    phone?: string;
  }) => Promise<RegisterUserResponseDto>;
  login: (res: Response, dto: LoginPayloadDto) => Promise<void>;
  refresh: (res: Response, refreshToken: string) => Promise<void>;

  refreshWs(client: Socket, refreshToken: string): Promise<any>;
}

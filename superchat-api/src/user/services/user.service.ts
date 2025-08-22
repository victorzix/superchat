import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import {
  BadRequestException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { compare, hash } from 'bcrypt';
import { UserBuilder } from '@/user/builders/user.builder';
import { RegisterUserResponseDto } from '@/user/dto/responses/register-user-response.dto';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export class UserService implements IUserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly repository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
    const checkUserName = await this.repository.getData({ phone: dto.phone });

    if (checkUserName) {
      throw new BadRequestException('Telefone já cadastrado');
    }

    const user = await this.repository.register(dto);

    return UserBuilder.buildRegisterUserResponse(user);
  }

  update: () => Promise<User>;
  delete: () => Promise<void>;

  async getData(id: string): Promise<RegisterUserResponseDto> {
    const user = await this.repository.getData({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async login(res: Response, dto: LoginPayloadDto): Promise<void> {
    const user = await this.repository.getData({ phone: dto.phone });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, username: user.phone };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '120m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie(`refresh_token`, refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return;
  }

  async refresh(res: Response, refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          phone: payload.phone,
        },
        { expiresIn: '120m' },
      );

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}

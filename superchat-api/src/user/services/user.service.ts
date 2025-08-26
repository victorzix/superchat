import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { compare } from 'bcrypt';
import { UserBuilder } from '@/user/builders/user.builder';
import { RegisterUserResponseDto } from '@/user/dto/responses/register-user-response.dto';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v2 as Cloudinary } from 'cloudinary';
import { RegisterUserRequestDto } from '@/user/dto/request/register-user-request.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly repository: IUserRepository,
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
    private jwtService: JwtService,
  ) {}

  async register(
    res: Response,
    dto: RegisterUserRequestDto,
    file?: Express.Multer.File,
  ): Promise<RegisterUserResponseDto> {
    const checkUserName = await this.repository.getData({ phone: dto.phone });

    if (checkUserName) {
      throw new BadRequestException('Telefone já cadastrado');
    }

    let profilePictureUrl: string | undefined;

    if (file) {
      profilePictureUrl = await new Promise<string>((resolve, reject) => {
        const upload = this.cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: dto.phone,
            overwrite: true,
            folder: dto.phone,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        );

        upload.end(file.buffer);
      });
    }

    const user = await this.repository.register({
      ...dto,
      profilePicture: profilePictureUrl,
    });

    await this.generateJwtToken(res, user);

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

    await this.generateJwtToken(res, user);

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

  private async generateJwtToken(res: Response, user: User) {
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
  }
}

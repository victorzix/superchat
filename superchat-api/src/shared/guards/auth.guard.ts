import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserService } from '../../user/interfaces/user.service.interface';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {USER_SERVICE} from "@/shared/symbols";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const token = request.cookies?.access_token;
    const refreshToken = request.cookies?.refresh_token;

    try {
      if (!token) {
        if (refreshToken) {
          await this.userService.refresh(response, refreshToken);
          return true;
        }
      }
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getData(payload.sub);
      if (!user) throw new UnauthorizedException('Usuário não encontrado');
      request.user = payload;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        await this.userService.refresh(response, refreshToken);
        return true;
      }
      throw new UnauthorizedException('Faça o login novamente');
    }
  }
}

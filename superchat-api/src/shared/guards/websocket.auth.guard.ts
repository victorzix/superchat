import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { USER_SERVICE } from '@/shared/symbols';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const token = cookies['access_token'];
    const refreshToken = cookies['refresh_token'];

    try {
      if (!token) {
        if (refreshToken) {
          client.data.user = await this.userService.refreshWs(
            client,
            refreshToken,
          );
          return true;
        }
        throw new UnauthorizedException('Token não encontrado');
      }

      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getData({ id: payload.sub });
      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      client.data.user = payload;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        client.data.user = await this.userService.refreshWs(
          client,
          refreshToken,
        );
        return true;
      }
      throw new UnauthorizedException('Faça o login novamente');
    }
  }
}

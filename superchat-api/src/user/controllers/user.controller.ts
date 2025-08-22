import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { HashPasswordPipe } from '@/shared/pipes/hash-password.pipe';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { Request, Response } from 'express';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { AuthGuard } from '@/shared/guards/auth.guard';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}

  @UsePipes(HashPasswordPipe)
  @Post()
  async register(@Body() dto: RegisterUserDto) {
    return await this.userService.register(dto);
  }

  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginPayloadDto) {
    await new Promise((resolve) => setTimeout(resolve, 1300));
    await this.userService.login(res, dto);
    res.status(HttpStatus.OK).end();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getData(@Req() req: Request) {
    return await this.userService.getData(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
  }
}

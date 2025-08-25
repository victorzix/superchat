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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HashPasswordPipe } from '@/shared/pipes/hash-password.pipe';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { Request, Response } from 'express';
import { LoginPayloadDto } from '@/user/dto/request/login-payload.dto';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RegisterUserRequestDto } from '@/user/dto/request/register-user-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}

  @UsePipes(HashPasswordPipe)
  @UseInterceptors(FileInterceptor('profilePicture'))
  @Post()
  async register(
    @Res() res: Response,
    @Body() dto: RegisterUserRequestDto,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ) {
    const user = await this.userService.register(res, dto, profilePicture);
    return res.status(201).json(user);
  }

  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginPayloadDto) {
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

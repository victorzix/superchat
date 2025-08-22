import { User } from '@/user/entities/user.entity';
import { RegisterUserResponseDto } from '@/user/dto/responses/register-user-response.dto';

export class UserBuilder {
  static buildRegisterUserResponse(user: User): RegisterUserResponseDto {
    return {
      id: user.id,
      phone: user.phone,
    };
  }
}

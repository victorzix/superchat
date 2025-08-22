import { Injectable, PipeTransform } from '@nestjs/common';
import { hash } from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: any) {
    if (value && value.password) {
      const hashed = await hash(value.password, 12);

      return {
        ...value,
        password: hashed,
      };
    }
    return value;
  }
}

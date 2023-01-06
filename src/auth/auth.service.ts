import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin() {
    return 'I am signed in already';
  }

  signup() {
    return 'I am signed up already';
  }
}

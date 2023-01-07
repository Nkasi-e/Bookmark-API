import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto';
import * as argon from 'argon2'; // for password hash

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(createDto: CreateAuthDto) {
    // generate the passwpord
    const hash = await argon.hash(createDto.password);
    // Save the new user in the db
    const user = await this.prisma.users.create({
      data: {
        firstname: createDto.firstname,
        lastname: createDto.lastname,
        email: createDto.email,
        hash, // hashed password
      },

      // selected field to return
      select: {
        id: true,
        email: true,
        creatAt: true,
        firstname: true,
        lastname: true,
      },
    });
    // return the saved user
    return user;
  }
  signin(createDto: CreateAuthDto) {
    return 'I am signed in already';
  }
}

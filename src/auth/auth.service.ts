import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto, LoginDto } from './dto';
import * as argon from 'argon2'; // for password hash
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(createDto: CreateAuthDto): Promise<string | any> {
    // generate the passwpord
    const hash = await argon.hash(createDto.password);
    // Save the new user in the db
    try {
      const user = await this.prisma.users.create({
        data: {
          firstname: createDto.firstname,
          lastname: createDto.lastname,
          email: createDto.email,
          hash, // hashed password
        },

        // selected field to return
        // select: {
        //   id: true,
        //   email: true,
        //   creatAt: true,
        //   firstname: true,
        //   lastname: true,
        // },
      });

      delete user.hash;
      // return the saved user
      // const token = this.signToken(user.id, user.email);
      // const data = {
      //   user,
      //   token,
      // };
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // error code for prisma duplicate field
          throw new ForbiddenException('email field already exists');
        }
      }
      throw error;
    }
  }
  async signin(createDto: LoginDto): Promise<any | string> {
    try {
      // find the user by email
      const user = await this.prisma.users.findUnique({
        where: { email: createDto.email },
      });

      // if user does not exist throw exception
      if (!user) throw new ForbiddenException('incorrect credencials');

      // compare password

      const comparePassword = await argon.verify(user.hash, createDto.password);

      // if password incorrect throw exception
      if (!comparePassword)
        throw new ForbiddenException('invalid email or password');

      // return back user
      delete user.hash;
      return this.signToken(user.id, user.email);
      // return user;
    } catch (error) {
      throw error;
    }
  }

  // signin token
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('EXPIRES_IN');

    const token = await this.jwt.signAsync(payload, { expiresIn, secret });

    return {
      access_token: token,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateUser(userId: string, editUserDto: EditUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        ...editUserDto,
      },
    });
    delete user.hash;
    return user;
  }
}

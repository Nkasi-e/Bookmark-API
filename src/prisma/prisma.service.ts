import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // GETTING ENV VARIABLE
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDb() {
    // transaction is when you order the db to do things in a specific order
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.users.deleteMany(),
    ]);
  }
}

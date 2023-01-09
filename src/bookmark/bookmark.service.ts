import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: string, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...createBookmarkDto,
      },
    });
    return bookmark;
  }

  async getBookmarks(userId: string) {
    const bookmark = await this.prisma.bookmark.findMany({
      where: {
        id: userId,
      },
    });
    return bookmark;
  }

  async getBookmarksById(userId: string, bookmarkId: string) {}

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    editBookmarkDto: EditBookmarkDto,
  ) {}

  async deleteBookmarkById(userId: string, bookmarkId: string) {}
}

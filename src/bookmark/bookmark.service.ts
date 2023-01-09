import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async getBookmarksById(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    editBookmarkDto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark) {
      throw new ForbiddenException('No bookmark with provided id found');
    }
    if (bookmark.userId !== userId) {
      throw new ForbiddenException('Access denied to edit bookmark');
    }
    const updateBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...editBookmarkDto,
      },
    });
    return updateBookmark;
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark) {
      throw new ForbiddenException('No bookmark with the provided id');
    }
    if (bookmark.userId !== userId) {
      throw new ForbiddenException('Unauthorize to delete bookmark');
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}

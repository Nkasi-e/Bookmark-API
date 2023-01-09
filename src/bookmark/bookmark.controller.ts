import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard) // for authorization, from nestjs // the JwtGuard is a custom guard
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, createBookmarkDto);
  }

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarksById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarksById(userId, bookmarkId);
  }

  @Patch('edit/:id')
  editBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
    @Body() editBookmarkDto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      editBookmarkDto,
    );
  }

  @Delete('delete/:id')
  deleteBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}

import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { PostsService } from 'src/posts/posts.service';

@Module({
  imports: [PostsService],
  providers: [AuthorsService, AuthorsResolver, PostsService],
  exports: [],
})
export class AuthorsModule {}

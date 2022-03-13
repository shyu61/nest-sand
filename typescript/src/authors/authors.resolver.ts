import {
  Args,
  Int,
  Parent,
  ResolveField,
  Resolver,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Author } from './author.model';
import { AuthorsService } from './authors.service';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/post.model';
import { AuthorInput } from './author.dto';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => Author)
  async getAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @Query(() => [Author])
  async getAuthors() {
    return this.authorsService.findAll();
  }

  @Mutation(() => Author)
  async createAuthor(@Args('author') author: AuthorInput) {
    return this.authorsService.create(author);
  }

  @ResolveField('posts', () => [Post])
  async getPosts(@Parent() author: Author) {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }
}

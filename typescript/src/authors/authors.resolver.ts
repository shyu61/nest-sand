import {
  Args,
  Int,
  Resolver,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Author } from './author.model';
import { AuthorsService } from './authors.service';
import { AuthorInput } from './author.dto';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
  ) {}

  @Query(() => Author)
  getAuthor(@Args('id', { type: () => Int }) id: number): Observable<Author> {
    return this.authorsService.getAuthor(id);
  }

  @Query(() => [Author])
  getAuthors(): Observable<Author[]> {
    const stream = this.authorsService.getAuthors();
    return stream.pipe(toArray());
  }

  @Mutation(() => Author)
  createAuthor(@Args('author') author: AuthorInput): Observable<Author> {
    return this.authorsService.createAuthor(author);
  }
}

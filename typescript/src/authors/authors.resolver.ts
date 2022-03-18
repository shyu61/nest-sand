import {
  Args,
  Int,
  Resolver,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Author } from './author.model';
import { AuthorsService } from './authors.service';
import { AuthorInput, AuthorUpdateInput } from './author.dto';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { UseFilters } from '@nestjs/common';
import { ExceptionFilter } from '../common/filters/rpc-exception.filter';

@Resolver(() => Author)
@UseFilters(new ExceptionFilter())
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
  ) {}
  
  @Query(() => [Author])
  listAuthors(): Observable<Author[]> {
    const stream = this.authorsService.listAuthors();
    return stream.pipe(toArray());
  }

  @Query(() => Author)
  getAuthor(@Args('id', { type: () => Int }) id: number): Observable<Author> {
    return this.authorsService.getAuthor(id);
  }

  @Mutation(() => Author)
  createAuthor(@Args('author') author: AuthorInput): Observable<Author> {
    return this.authorsService.createAuthor(author);
  }

  @Mutation(() => Author)
  updateAuthor(@Args('author') author: AuthorUpdateInput): Observable<Author> {
    return this.authorsService.updateAuthor(author);
  }

  @Mutation(() => Boolean)
  deleteAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.deleteAuthor(id);
  }
}

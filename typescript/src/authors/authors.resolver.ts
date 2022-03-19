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
  listAuthors(@Args('id', { type: () => [Int] }) ids: number[]): Observable<Author[]> {
    const stream = this.authorsService.listAuthors(ids);
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

// rxjs
// Observable: 未来にわたってくるデータを保持するオブジェクト。
// Subscribe:  Observableから実際のデータを取り出すためのメソッド。
// Subscriber: Subscribeで取り出したデータに対して行う処理を指定する。next, error, completeの3つのメソッドを持つ。
// Subject:    Observableのように振る舞うが、マルチキャストを行うことができるオブジェクト。

// Observable --> Subject --> Observer
//                        \--> Observer
//             |______Subscribe________|

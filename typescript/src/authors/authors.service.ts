import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable, from, ReplaySubject } from 'rxjs';
import { grpcClientOptions } from 'src/grpc-client-options';
import { AuthorInput, AuthorUpdateInput } from './author.dto';
import { Author } from './author.model';

interface AuthorsGrpcService {
  listAuthors(id: Observable<{ id: number }>): Observable<Author>;
  getAuthor({ id: number }): Observable<Author>;
  createAuthor({ firstName, lastName: string }): Observable<Author>;
  updateAuthor({ id: number }): Observable<Author>;
  deleteAuthor({ id: number }): Observable<{}>;
}

@Injectable()
export class AuthorsService implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private authorsGrpcService: AuthorsGrpcService;

  onModuleInit() {
    this.authorsGrpcService = this.client.getService<AuthorsGrpcService>('AuthorsService');
  }

  listAuthors(ids: number[]): Observable<Author> {
    const ids$ = new ReplaySubject<{ id: number }>();
    ids.forEach(id => ids$.next({ id }));
    ids$.complete();
    return this.authorsGrpcService.listAuthors(ids$.asObservable());
  }

  getAuthor(id: number): Observable<Author> {
    return this.authorsGrpcService.getAuthor({ id });
  }

  createAuthor(author: AuthorInput): Observable<Author> {
    return this.authorsGrpcService.createAuthor(author);
  }

  updateAuthor(author: AuthorUpdateInput): Observable<Author> {
    return this.authorsGrpcService.updateAuthor(author);
  }

  deleteAuthor(id: number): Boolean {
    const res = this.authorsGrpcService.deleteAuthor({ id });
    lastValueFrom(res);
    return true;
  }
}

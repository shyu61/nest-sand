import { Injectable, OnModuleInit, UseFilters } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { grpcClientOptions } from 'src/grpc-client-options';
import { AuthorInput, AuthorUpdateInput } from './author.dto';
import { Author } from './author.model';
import { ExceptionFilter } from '../common/filters/rpc-exception.filter';

interface AuthorsGrpcService {
  getAuthor({ id: number }): Observable<Author>;
  getAuthors({}): Observable<Author>;
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

  getAuthor(id: number): Observable<Author> {
    return this.authorsGrpcService.getAuthor({ id });
  }

  getAuthors(): Observable<Author> {
    return this.authorsGrpcService.getAuthors({});
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

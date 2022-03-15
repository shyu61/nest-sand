import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/grpc-client-options';
import { AuthorInput } from './author.dto';
import { Author } from './author.model';

interface AuthorsGrpcService {
  getAuthor({ id: number }): Observable<Author>;
  getAuthors({}): Observable<Author>;
  createAuthor({ firstName, lastName: string }): Observable<Author>;
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

  createAuthor(author: AuthorInput) {
    return this.authorsGrpcService.createAuthor(author);
  }
}

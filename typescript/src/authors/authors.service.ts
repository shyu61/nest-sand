import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/grpc-client-options';
import { AuthorInput } from './author.dto';
import { Author } from './author.model';

interface AuthorsGrpcService {
  getAuthor({ id: number }): Observable<Author>;
  getAuthors({}): Observable<Author>;
}

@Injectable()
export class AuthorsService implements OnModuleInit {

  authors: Author[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      posts: [
        {
          id: 1,
          title: 'Lorem ipsum',
          votes: 1,
        },
      ],
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      posts: [
        {
          id: 2,
          title: 'Lorem ipsum',
          votes: 2,
        },
      ],
    },
  ];

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
    const newAuthor = {
      id: this.authors.length + 1,
      ...author,
      posts: [],
    };
    this.authors.push(newAuthor);
    return newAuthor;
  }
}

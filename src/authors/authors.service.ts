import { Injectable } from '@nestjs/common';
import { Author } from './author.model';

@Injectable()
export class AuthorsService {
  findOneById(id: number): Author {
    console.log(`findOneById(${id})`);
    return {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      posts: [
        {
          id: 1,
          title: 'Post 1',
          votes: 1,
        },
      ],
    };
  }
}

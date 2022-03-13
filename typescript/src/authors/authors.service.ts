import { Injectable } from '@nestjs/common';
import { AuthorInput } from './author.dto';
import { Author } from './author.model';

@Injectable()
export class AuthorsService {
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

  findOneById(id: number): Author {
    console.log(`findOneById(${id})`);
    return this.authors.find((author) => author.id === id);
  }

  findAll(): Author[] {
    console.log('findAll()');
    return this.authors;
  }

  create(author: AuthorInput) {
    const newAuthor = {
      id: this.authors.length + 1,
      ...author,
      posts: [],
    };
    this.authors.push(newAuthor);
    return newAuthor;
  }
}

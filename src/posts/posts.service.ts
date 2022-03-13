import { Injectable } from '@nestjs/common';
import { Post } from './post.model';

@Injectable()
export class PostsService {
  findAll({ authorId }: { authorId: number }): Post[] {
    console.log(`findAll(${authorId})`);
    return [
      {
        id: 1,
        title: 'Post 1',
        votes: 1,
      },
      {
        id: 2,
        title: 'Post 2',
        votes: 2,
      },
    ];
  }
}

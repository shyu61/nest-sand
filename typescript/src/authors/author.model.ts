import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../posts/post.model';

@ObjectType()
export class Author {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => [Post], { nullable: true })
  posts: Post[];
}

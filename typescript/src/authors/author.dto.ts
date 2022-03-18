import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class AuthorInput {
  @Field()
  @MaxLength(30)
  firstName: string;

  @Field()
  @MaxLength(30)
  lastName: string;
}

@InputType()
export class AuthorUpdateInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @MaxLength(30)
  firstName?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  lastName?: string;
}

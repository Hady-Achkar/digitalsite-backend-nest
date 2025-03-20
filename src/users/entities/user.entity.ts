import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string | null;

  @Field({ nullable: true })
  firstName?: string | null;

  @Field({ nullable: true })
  lastName?: string | null;
}

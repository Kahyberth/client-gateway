import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  profile_banner?: string;

  @Field({ nullable: true })
  profile_picture?: string;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  user_biography?: string;

  @Field({ nullable: true })
  availability_status?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field({ nullable: true })
  location?: string;

  @Field(() => [String], { nullable: true })
  social_links?: string[];

  @Field({ nullable: true })
  timezone?: string;

  @Field(() => User)
  user: User;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { Team } from './team.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  last_login?: Date;

  @Field({ nullable: true })
  is_active?: boolean;

  @Field({ nullable: true })
  is_available?: boolean;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => [Role])
  roles: Role[];

  @Field(() => [Team])
  teams: Team[];
}

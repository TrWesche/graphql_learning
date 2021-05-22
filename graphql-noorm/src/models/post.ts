import { Field, ID, ObjectType } from "type-graphql";
import User from "./user";
import Comment from "./comment";

@ObjectType()
export default class Post {
    @Field(type => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    name: string;

    @Field()
    published: boolean;

    @Field(type => User)
    author: User

    @Field(type => [Comment], {nullable: "items"})
    comments: Comment[]
};
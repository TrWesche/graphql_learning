import { Field, Int, ID, ObjectType } from "type-graphql";
import Post from "./post";
import Comment from "./comment";

@ObjectType()
export default class User {
    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field(type => Int, {nullable: true})
    age?: number;

    @Field(type => [Post], {nullable: "items"})
    posts: Post[];

    @Field(type => [Comment], {nullable: "items"})
    comments: Comment[];
};
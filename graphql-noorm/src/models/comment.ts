import { Field, ID , ObjectType } from "type-graphql";
import User from "./user";
import Post from "./post";

@ObjectType()
export default class Comment {
    @Field(type => ID)
    id: string;

    @Field()
    text: string;

    @Field(type => User)
    author: User;

    @Field(type => Post)
    post: Post;
};
import { FieldResolver, Resolver, Root } from "type-graphql";
import db from '../../db';
import User from '../../models/user';

@Resolver(of => User)
export default class CommentResolver {
    
    @FieldResolver()
    posts(@Root() user: User) {
        return db.posts.filter((post) => {
            return post.author_id === user.id;
        })
    }

    @FieldResolver()
    comments(@Root() user: User) {
        return db.comments.filter((comment) => {
            return comment.author_id === user.id;
        })
    }
}
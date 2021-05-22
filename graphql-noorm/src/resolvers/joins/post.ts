import { FieldResolver, Resolver, Root } from "type-graphql";
import db from '../../db';
import Post from '../../models/post';

@Resolver(of => Post)
export default class PostResolver {
    
    @FieldResolver()
    author(@Root() post: Post) {
        return db.users.find((user) => {
            return user.id === post.author.id;
        })
    }

    @FieldResolver()
    comments(@Root() post: Post) {
        return db.comments.filter((comment) => {
            return comment.post_id === post.id;
        })
    }
}
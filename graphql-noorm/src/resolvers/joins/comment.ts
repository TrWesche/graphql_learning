import { FieldResolver, Resolver, Root } from "type-graphql";
import db from '../../db';
import Comment from '../../models/comment';

@Resolver(of => Comment)
export default class CommentResolver {
    
    @FieldResolver()
    author(@Root() comment: Comment) {
        return db.users.find((user) => {
            return user.id === comment.author.id;
        })
    }

    @FieldResolver()
    post(@Root() comment: Comment) {
        return db.posts.find((post) => {
            return post.id === comment.post.id;
        })
    }
}

// export const resolvers = {
//     author(parent, args, { db }, info) {
//         return db.users.find((user) => {
//             return user.id === parent.author_id;
//         })
//     },
//     post(parent, args, { db }, info) {
//         return db.posts.find((post) => {
//             return post.id === parent.post_id;
//         })
//     }
// };
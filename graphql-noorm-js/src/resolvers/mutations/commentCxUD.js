import { v4 as uuidV4 } from "uuid";

const resolvers = {
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author_id;
        })

        if (!userExists) {
            throw new Error(`User not found.`)
        }

        const postValid = db.posts.some((post) => {
            return post.id === args.data.post_id && post.published;
        })

        if (!postValid) {
            throw new Error(`Could not find target post.`)
        }

        const comment = {
            id: uuidV4(),
            ...args.data
        }

        db.comments.push(comment);
        pubsub.publish(`comment:${args.data.post_id}`, { 
            comment: {
                mutation: "CREATED",
                data: comment
            }
        })

        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const {comment_id, data} = args;

        const comment = db.comments.find(comment => comment.id === comment_id);

        if (!comment) {
            throw new Error(`Comment not found`)
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment:${comment.post_id}`, { 
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })

        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.comment_id);

        if (commentIndex === -1) {
            throw new Error(`Comment not found`);
        }

        const [comment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment:${comment.post_id}`, { 
            comment: {
                mutation: "DELETED",
                data: comment
            }
        })

        return comment;
    }
}

export default resolvers;
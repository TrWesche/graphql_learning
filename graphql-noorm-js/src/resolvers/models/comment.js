const resolvers = {
    // Field Resolvers
    Field: {
        Comment: {
            async author(parent, args, { CommentRepo }, info) {
                const result = await CommentRepo.getCommentAuthor(parent);
                return result[0];
            },
            async post(parent, args, { CommentRepo }, info) {
                const result = await CommentRepo.getCommentPost(parent);
                return result[0];
            }
        }
    },
    // Query Resolvers
    Query: {
        async comments(parent, args, { CommentRepo }, info) {
            return await CommentRepo.getAllComments();
        }
    },
    // Mutation Resolvers
    Mutation: {
        async createComment(parent, args, ctx, info) {
            const { AuthorizationRepo, CommentRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { data } = args;
            
            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user);
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            const postCheck = await PostRepo.getPostByKey(data.post_key);
            if (postCheck.length === 0 || !postCheck[0].published) {
                throw new Error(`Count not find target post.`)
            }
    
            const comments = await CommentRepo.createComment(rootValue.user, data);
            return comments[0];
        },
        async updateComment(parent, args, ctx, info) {
            const { AuthorizationRepo, CommentRepo } = ctx;
            const { rootValue } = info;
            const { comment_key, data } = args;
            
            const authCheck = await AuthorizationRepo.authorizeCommentAction(rootValue.user, comment_key);
            if (authCheck.length === 0) {
                throw new Error(`Unable to update comment.`);
            }
    
            const updatedComments = await CommentRepo.updateComment(comment_key, data);
            return updatedComments[0];
        },
        async deleteComment(parent, args, ctx, info) {
            const { AuthorizationRepo, CommentRepo } = ctx;
            const { rootValue } = info;
            const { comment_key } = args;
    
            const authCheck = await AuthorizationRepo.authorizeCommentAction(rootValue.user, comment_key);
            if (authCheck.length === 0) {
                throw new Error(`Unable to delete comment.`);
            }
    
            const deletedComments = await CommentRepo.deleteComment(comment_key);
            return deletedComments[0];
        }
    },
    // Subscription Resolvers
    Subscription: {
        comment: {
            subscribe(parent, { post_id }, { db, pubsub }, info) {
                const post = db.posts.find((post) => post.id === post_id && post.published);
    
                if (!post) {
                    throw new Error(`Unable to subscribe, post not found.`)
                }
    
                return pubsub.asyncIterator(`comment:${post_id}`); // creates a subscription with a unique id for the post
            }
        }
    }
}

export default resolvers;
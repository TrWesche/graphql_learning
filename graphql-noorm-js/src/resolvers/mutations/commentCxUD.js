const resolvers = {
    async createComment(parent, args, ctx, info) {
        const { CommentRepo, UserRepo, PostRepo } = ctx;
        const { data } = args;
        
        const userCheck = await UserRepo.getUserByID(data.author_id);
        if (userCheck.length === 0) {
            throw new Error(`User not found.`)
        }

        const postCheck = await PostRepo.getPostByID(data.post_id);
        if (postCheck.length === 0 || !postCheck[0].published) {
            throw new Error(`Count not find target post.`)
        }

        const comments = await CommentRepo.createComment(data);
        return comments[0];
    },
    async updateComment(parent, args, ctx, info) {
        const { CommentRepo } = ctx;
        const { comment_id, data } = args;

        const commentCheck = await CommentRepo.getCommentByID(comment_id);

        if (commentCheck.length === 0) {
            throw new Error(`Comment not found`)
        }

        const updatedComments = await CommentRepo.updateComment(comment_id, data);
        return updatedComments[0];
    },
    async deleteComment(parent, args, ctx, info) {
        const { CommentRepo } = ctx;
        const { comment_id } = args;

        const commentCheck = await CommentRepo.getCommentByID(comment_id);

        if (commentCheck.length === 0) {
            throw new Error(`Comment not found`)
        }

        const deletedComments = await CommentRepo.deleteComment(comment_id);
        return deletedComments[0];
    }
}

export default resolvers;
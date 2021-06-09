const resolvers = {
    // Field Resolvers
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
}

export default resolvers;
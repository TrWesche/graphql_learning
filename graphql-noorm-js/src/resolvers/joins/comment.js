const resolvers = {
    // Field Resolvers
    Comment: {
        async author(parent, args, { CommentRepo }, info) {
            return await CommentRepo.getCommentAuthor(parent.id);
        },
        async post(parent, args, { CommentRepo }, info) {
            return await CommentRepo.getCommentPost(parent.id);
        }
    }
}

export default resolvers;
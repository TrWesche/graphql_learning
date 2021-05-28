const resolvers = {
    async comments(parent, args, { CommentRepo }, info) {
        return await CommentRepo.getAllComments();
    }
}

export default resolvers;
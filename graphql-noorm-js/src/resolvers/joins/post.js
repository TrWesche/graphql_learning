const resolvers = {
    // Field Resolvers
    Post: {
        async author(parent, args, { PostRepo }, info) {
            return await PostRepo.getPostAuthors(parent);
        },
        async comments(parent, args, { PostRepo }, info) {
            return await PostRepo.getPostComments(parent);
        }
    }
}

export default resolvers;
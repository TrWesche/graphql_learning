const resolvers = {
    // Field Resolvers
    Post: {
        async author(parent, args, { PostRepo }, info) {
            return await PostRepo.getPostAuthors(parent.id);
        },
        async comments(parent, args, { PostRepo }, info) {
            return await PostRepo.getPostComments(parent.id);
        }
    }
}

export default resolvers;
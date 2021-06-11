const resolvers = {
    // Field Resolvers
    Post: {
        async author(parent, args, { PostRepo }, info) {
            const result = await PostRepo.getPostAuthors(parent);
            return result[0];
        },
        async comments(parent, args, { PostRepo }, info) {
            return await PostRepo.getPostComments(parent);
        }
    }
}

export default resolvers;
const resolvers = {
    async posts(parent, args, ctx, info) {
        const { PostRepo } = ctx;
        const { query, publish_status } = args;

        if (!query && publish_status === undefined) {
            return await PostRepo.getAllPosts();
        }

        return await PostRepo.getFilteredPosts(publish_status, query);
    }
};

export default resolvers;
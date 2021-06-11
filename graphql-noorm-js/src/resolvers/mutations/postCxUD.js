const resolvers = {
    async createPost(parent, args, ctx, info) {
        const { UserRepo, PostRepo } = ctx;
        const { data } = args;

        const userCheck = await UserRepo.getUserByID(data.author_id);
        if (userCheck.length === 0) {
            throw new Error(`User not found.`)
        }

        const post = await PostRepo.createPost(data);
        return post[0];
    },
    async updatePost(parent, args, ctx, info) {
        const { PostRepo } = ctx;
        const { post_id, data } = args;

        const postCheck = await PostRepo.getPostByID(post_id);
        if (postCheck.length === 0) {
            throw new Error(`Post not found.`)
        }

        const updatedPosts = await PostRepo.updatePost(post_id, data);
        return updatedPosts[0];
    },
    async deletePost(parent, args, ctx, info) {
        const { PostRepo } = ctx;
        const { post_id } = args;

        const postCheck = await PostRepo.getPostByID(post_id);
        if (postCheck.length === 0) {
            throw new Error(`Post not found.`)
        }

        const deletedPosts = await PostRepo.deletePost(post_id);
        return deletedPosts[0];
    }
};

export default resolvers;
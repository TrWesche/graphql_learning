const resolvers = {
    createPost(parent, args, ctx, info) {
        const { UserRepo, PostRepo } = ctx;
        const { user_id, data } = args;

        const userCheck = await UserRepo.getUserByID(user_id);
        if (userCheck.length === 0) {
            throw new Error(`User not found.`)
        }

        const post = await PostRepo.createPost(user_id, data);
        return post;
    },
    updatePost(parent, args, ctx, info) {
        const { PostRepo } = ctx;
        const { post_id, data } = args;

        const postCheck = await PostRepo.getPostById(post_id);
        if (postCheck.length === 0) {
            throw new Error(`Post not found.`)
        }

        const updatedPosts = await PostRepo.updatePost(post_id, data);
        return updatedPosts[0];
    },
    deletePost(parent, args, ctx, info) {
        const { PostRepo } = ctx;
        const { post_id } = args;

        const postCheck = await PostRepo.getPostById(post_id);
        if (postCheck.length === 0) {
            throw new Error(`Post not found.`)
        }

        const deletedPosts = await PostRepo.deletePost(post_id);
        return deletedPosts[0];

        // TODO: Implement comment deletion
        // db.comments = db.comments.filter((comment) => {
        //     return comment.post_id !== args.post_id;
        // })
    }
};

export default resolvers;
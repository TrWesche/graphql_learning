const resolvers = {
    // Field Resolvers
    Field: {
        Post: {
            async author(parent, args, { PostRepo }, info) {
                const result = await PostRepo.getPostAuthors(parent);
                return result[0];
            },
            async comments(parent, args, { PostRepo }, info) {
                return await PostRepo.getPostComments(parent);
            }
        }
    },
    // Query Resolvers
    Query: {
        async posts(parent, args, ctx, info) {
            const { PostRepo } = ctx;
            const { query, publish_status } = args;
    
            if (!query && publish_status === undefined) {
                return await PostRepo.getAllPosts();
            }
    
            return await PostRepo.getFilteredPosts(publish_status, query);
        }
    },
    // Mutation Resolvers
    Mutation: {
        async createPost(parent, args, ctx, info) {
            const { AuthorizationRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { data } = args;
    
            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user.key);
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            const post = await PostRepo.createPost(rootValue.user.key, data);
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
    },
    // Subscription Resolvers
    Subscription: {
        post: {
            subscribe(parent, args, { pubsub }, info) {
                return pubsub.asyncIterator('post');
            }
        }
    }
}

export default resolvers;
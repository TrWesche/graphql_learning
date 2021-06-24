const resolvers = {
    // Field Resolvers
    Field: {
        Post: {
            async author(parent, args, ctx, info) {
                const { PostRepo } = ctx;
                const result = await PostRepo.getPostAuthors(parent);
                return result[0];
            },
            async comments(parent, args, ctx, info) {
                const { PostRepo } = ctx;
                const { count, offset } = args;
                return await PostRepo.getPostComments(parent, count, offset);
            }
        }
    },
    // Query Resolvers
    Query: {
        async posts(parent, args, ctx, info) {
            const { PostRepo } = ctx;
            const { 
                query, 
                author_key, 
                post_key, 
                count, 
                offset,
                orderBy
            } = args;

            if (!query && !author_key && !post_key) {
                return await PostRepo.getPublicPosts(count, offset, orderBy);
            }

            return await PostRepo.getFilteredPosts(query, author_key, post_key, true, count, offset, orderBy);
        },
        async postsPrivate(parent, args, ctx, info) {
            const { AuthorizationRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { query, post_key, published, count, offset } = args;

            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user);
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }

            return await PostRepo.getFilteredPosts(query, rootValue.user.key, post_key, published, count, offset);
        }
    },
    // Mutation Resolvers
    Mutation: {
        async createPost(parent, args, ctx, info) {
            const { AuthorizationRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { data } = args;
    
            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user);
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            const post = await PostRepo.createPost(rootValue.user, data);
            return post[0];
        },
        async updatePost(parent, args, ctx, info) {
            const { AuthorizationRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { post_key, data } = args;
    
            const postCheck = await AuthorizationRepo.authorizePostAction(rootValue.user, post_key)
            if (postCheck.length === 0) {
                throw new Error(`Unable to update post.`)
            }
    
            const updatedPosts = await PostRepo.updatePost(post_key, data);
            return updatedPosts[0];
        },
        async deletePost(parent, args, ctx, info) {
            const { AuthorizationRepo, PostRepo } = ctx;
            const { rootValue } = info;
            const { post_key } = args;
    
            const postCheck = await AuthorizationRepo.authorizePostAction(rootValue.user, post_key)
            if (postCheck.length === 0) {
                throw new Error(`Unable to delete post.`)
            }
    
            const deletedPosts = await PostRepo.deletePost(post_key);
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
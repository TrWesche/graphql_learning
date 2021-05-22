const resolvers = {
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post');
        }
    }
}

export default resolvers;
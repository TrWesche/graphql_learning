export const resolvers = {
    comment: {
        subscribe(parent, { post_id }, { db, pubsub }, info) {
            const post = db.posts.find((post) => post.id === post_id && post.published);

            if (!post) {
                throw new Error(`Unable to subscribe, post not found.`)
            }

            return pubsub.asyncIterator(`comment:${post_id}`); // creates a subscription with a unique id for the post
        }
    }
}
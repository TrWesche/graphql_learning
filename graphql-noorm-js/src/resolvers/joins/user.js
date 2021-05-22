const resolvers = {
    // Field Resolvers
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter((post) => {
                return post.author_id === parent.id;
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.author_id === parent.id;
            })
        }
    }
}

export default resolvers;
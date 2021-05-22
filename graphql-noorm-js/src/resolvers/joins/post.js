const resolvers = {
    // Field Resolvers
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author_id;
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.post_id === parent.id;
            })
        }
    }
}

export default resolvers;
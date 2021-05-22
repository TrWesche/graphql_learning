const resolvers = {
    comments(parent, args, { db }, info) {
        return db.comments;
    }
}

export default resolvers;
const resolvers = {
    // Field Resolvers
    User: {
        async posts(parent, args, { UserRepo }, info) {
            return await UserRepo.getUserPosts(parent);
        },
        async comments(parent, args, { UserRepo }, info) {
            return await UserRepo.getUserComments(parent);
        }
    }
}

export default resolvers;
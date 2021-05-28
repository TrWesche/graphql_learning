const resolvers = {
    // Field Resolvers
    User: {
        async posts(parent, args, { UserRepo }, info) {
            return await UserRepo.getUserPosts(parent.id);
        },
        async comments(parent, args, { UserRepo }, info) {
            return await UserRepo.getUserComments(parent.id);
        }
    }
}

export default resolvers;
const resolvers = {
    async users(parent, args, { UserRepo }, info) {
        if (!args.query) {
            return await UserRepo.getAllUsers();
        }

        return await UserRepo.getUsersByName(args.query);
    }
}

export default resolvers;
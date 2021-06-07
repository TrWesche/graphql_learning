const resolvers = {
    async users(parent, args, { UserRepo }, info) {
        if (args.id) {
            return await UserRepo.getUserByID(args.id);
        }

        if (args.email) {
            return await UserRepo.getUserByEmail(args.email);
        }

        if (args.query) {
            return await UserRepo.getUsersByName(args.query);
        }

        return await UserRepo.getAllUsers();
    }
}

export default resolvers;
const resolvers = {
    async users(parent, args, { UserRepo }, info) {
        if (!args.query) {
            const result = await UserRepo.getAllUsers();
            console.log(result);
            return result;
        }

        return await UserRepo.getUsersByName(args.query);
    }
}

export default resolvers;
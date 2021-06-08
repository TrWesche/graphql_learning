// import { v4 as uuidV4 } from "uuid";

const resolvers = {
    async createUser(parent, args, { UserRepo }, info) {
        const emailCheck = await UserRepo.getUserByEmail(args.data.email);

        if (emailCheck.length !== 0) {
            throw new Error(`An account has already been registered under that email.`)
        }

        const users = await UserRepo.createUser(args.data);

        return users[0];
    },
    async deleteUser(parent, args, { UserRepo }, info) {
        const userCheck = await UserRepo.getUserByID(args.user_id);

        if (userCheck.length === 0) {
            throw new Error(`User not found`);
        }

        const deletedUser = await UserRepo.deleteUser(args.user_id);

        // TODO: Need to re-implement this with queries
        // db.posts = db.posts.filter((post) => {
        //     const match = post.author_id === args.user_id;

        //     if (match) {
        //         db.comments = db.comments.filter((comment) => {
        //             return comment.post_id !== post.id;
        //         })
        //     }

        //     return !match
        // })

        // db.comments = db.comments.filter((comment) => {
        //     return comment.author_id !== args.user_id;
        // })

        return deletedUser;
    },
    async updateUser(parent, args, { UserRepo }, info) {
        const {user_id, data} = args;

        const userCheck = await UserRepo.getUserByID(user_id);

        if (userCheck.length === 0) {
            throw new Error(`User not found`);
        }

        if (typeof data.email === 'string') {
            const emailCheck = await UserRepo.getUserByEmail(data.email);

            if (emailCheck.length !== 0) {
                throw new Error(`An account has already been registered under that email.`)
            }
        }

        const updatedUsers = await UserRepo.updateUser(user_id, data);
        return updatedUsers[0];
    }
};

export default resolvers;
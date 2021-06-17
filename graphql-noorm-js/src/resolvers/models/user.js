import AuthHandling from "../../helpers/authHandling";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../../config";

const resolvers = {
    // Field Resolvers
    Field: {
        User: {
            async posts(parent, args, ctx, info) {
                const { UserRepo } = ctx;
                return await UserRepo.getUserPosts(parent);
            },
            async comments(parent, args, ctx, info) {
                const { UserRepo } = ctx;
                return await UserRepo.getUserComments(parent);
            }
        }
    },
    // Query Resolvers
    Query: {
        async users(parent, args, ctx, info) {
            const { UserRepo } = ctx;

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
    },
    // Mutation Resolvers
    Mutation: {
        async createUser(parent, args, ctx, info) {
            const { UserRepo, response } = ctx;
            const { data } = args;
    
            const emailCheck = await UserRepo.getUserByEmail(data.email);
    
            if (emailCheck.length !== 0) {
                throw new Error(`An account has already been registered under that email.`)
            }
    
            const encryptedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
            const protectedData = {
                ...data,
                password: encryptedPassword
            }
    
            const users = await UserRepo.createUser(protectedData);
            const returnUser = {
                key: users[0]._key,
                name: users[0].name,
            }

            AuthHandling.generateCookies(response, returnUser);
            return users[0];
        },
        async updateUser(parent, args, ctx, info) {
            // Checked Updated Version Using Validated Token Data - 6/16/2021
            const { AuthorizationRepo, UserRepo } = ctx;
            const { rootValue } = info;
            const { data } = args;

            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user.key);

            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            if (typeof data.email === 'string') {
                const emailCheck = await UserRepo.getUserByEmail(data.email);
    
                if (emailCheck.length !== 0) {
                    throw new Error(`An account has already been registered under that email.`)
                }
            }
    
            if (typeof data.password === 'string') {
                const encryptedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
                const protectedData = {
                    ...data,
                    password: encryptedPassword
                }
                const updatedUsers = await UserRepo.updateUser(rootValue.user.key, protectedData);
                return updatedUsers[0];
            }

            const updatedUsers = await UserRepo.updateUser(rootValue.user.key, data);
            return updatedUsers[0];    
        },
        async deleteUser(parent, args, { UserRepo }, info) {
            const userCheck = await UserRepo.getUserByID(args.user_id);
    
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            const deletedUsers = await UserRepo.deleteUser(args.user_id);
    
            return deletedUsers[0];
        }
    }
}

export default resolvers;
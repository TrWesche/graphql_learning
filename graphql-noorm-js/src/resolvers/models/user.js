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
            const { key, email, query } = args;

            if (key) {
                return await UserRepo.getUserByKey(key);
            }
    
            if (email) {
                return await UserRepo.getUserByEmail(email);
            }
    
            if (query) {
                return await UserRepo.getUsersByName(query);
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

            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user);
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
                const updatedUsers = await UserRepo.updateUser(rootValue.user, protectedData);
                return updatedUsers[0];
            }

            const updatedUsers = await UserRepo.updateUser(rootValue.user, data);
            return updatedUsers[0];    
        },
        async deleteUser(parent, args, ctx, info) {
            const { AuthorizationRepo, UserRepo, response } = ctx;
            const { rootValue } = info;

            const userCheck = await AuthorizationRepo.authorizeUserAction(rootValue.user);
            if (userCheck.length === 0) {
                throw new Error(`User not found`);
            }
    
            const deletedUsers = await UserRepo.deleteUser(rootValue.user);
            AuthHandling.clearCookies(response);
            return deletedUsers[0];
        }
    }
}

export default resolvers;
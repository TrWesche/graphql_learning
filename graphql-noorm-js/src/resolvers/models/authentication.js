import AuthHandling from "../../helpers/authHandling";
import bcrypt from "bcrypt";

const resolvers = {
    // Mutation Resolvers
    Mutation: {
        async loginUser(parent, args, ctx, info) {
            const { UserRepo, response } = ctx;
            const { data } = args;
            
            const users = await UserRepo.getUserByEmail(data.email);
            if (users.length !== 0) {
                const isValid = await bcrypt.compare(data.password, users[0].password);
                if (isValid) {
                    const returnUser = {
                        key: users[0]._key,
                        name: users[0].name,
                    }
                    AuthHandling.generateCookies(response, returnUser);
                    return users[0];
                }
            }

            throw new Error(`Invalid Email/Password.`)
        },
        // async logoutUser(parent, args, ctx, info) {
        //     // TODO
        //     const { CommentRepo } = ctx;
        //     const { comment_id, data } = args;
    
        //     const commentCheck = await CommentRepo.getCommentByID(comment_id);
    
        //     if (commentCheck.length === 0) {
        //         throw new Error(`Comment not found`)
        //     }
    
        //     const updatedComments = await CommentRepo.updateComment(comment_id, data);
        //     return updatedComments[0];
        // }
    }
}

export default resolvers;
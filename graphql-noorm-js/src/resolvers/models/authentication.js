import AuthHandling from "../../helpers/authHandling";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../../config";

const resolvers = {
    // Mutation Resolvers
    Mutation: {
        async loginUser(parent, args, ctx, info) {
            // TODO
            const { UserRepo } = ctx;
            const { data } = args;
            
            const user = await UserRepo.getUserByEmail(data.email);
            if (user.length !== 0) {
                const isValid = await bcrypt.compare(data.password, user[0].password);
                if (isValid) {
                    AuthHandling.generateCookies()
                    return user[0];
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
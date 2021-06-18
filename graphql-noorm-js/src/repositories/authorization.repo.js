import {default as db, collections } from '../db';
import { aql } from 'arangojs'

class AuthorizationRepo {
    static async authorizeUserAction(user_object) {
        if (user_object === undefined) {
            throw new Error(`Please Login to Continiue`);
        }

        const query = aql`
            FOR user IN ${collections.Users}
                FILTER user._key == ${user_object.key}
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async authorizePostAction(user_object, post_key) {
        if (user_object === undefined) {
            throw new Error(`Please Login to Continiue`);
        }

        const user_id = `${collections.Users.name}/${user_object.key}`;
        const post_id = `${collections.Posts.name}/${post_key}`;
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${user_id} ${collections.UserPosts}
                FILTER v._id == ${post_id}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async authorizeCommentAction(user_object, comment_key) {
        if (user_object === undefined) {
            throw new Error(`Please Login to Continiue`);
        }

        const user_id = `${collections.Users.name}/${user_object.key}`;
        const comment_id = `${collections.Comments.name}/${comment_key}`;
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${user_id} ${collections.UserComments}
                FILTER v._id == ${comment_id}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
}

export default AuthorizationRepo;
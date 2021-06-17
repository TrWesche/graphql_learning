import {default as db, collections } from '../db';
import { aql } from 'arangojs'

class AuthorizationRepo {
    static async authorizeUserAction(uid_token) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER user._key == ${uid_token}
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async authorizePostAction(uid_token, post_id) {
        const uid_token_full = `${collections.Users.name}/${uid_token}`;
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${uid_token_full} ${collections.UserPosts}
                FILTER v._to == ${post_id}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async authorizeCommentAction(uid_token, comment_id) {
        const uid_token_full = `${collections.Users.name}/${uid_token}`;
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${uid_token_full} ${collections.UserCollections}
                FILTER v._to == ${comment_id}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
}

export default AuthorizationRepo;
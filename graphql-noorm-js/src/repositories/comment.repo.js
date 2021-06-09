import {default as db, collections } from '../db';
import { aql } from 'arangojs'

class CommentRepo {
    // Manually Checked - OK (6/8/2021)
    static async getAllComments() {
        let query = aql`
            FOR comment IN ${collections.Comments}
                LIMIT 100
                RETURN comment
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/8/2021)
    static async getCommentPost(parent) {
        let query = aql`
            FOR v IN 1..1 INBOUND ${parent} ${collections.PostComments}
                RETURN v
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/8/2021)
    static async getCommentAuthor(parent) {
        let query = aql`
            FOR v IN 1..1 INBOUND ${parent} ${collections.UserComments}
                RETURN v
            `;
        
        const cursor = await db.query(query);
        return await cursor.all();
    }
}

export default CommentRepo;
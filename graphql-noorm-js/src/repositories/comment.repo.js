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

    static async getCommentByID(data) {
        let query = aql`
            FOR comment IN ${collections.Comments}
                FILTER comment._id == ${data}
                LIMIT 1
                RETURN comment
        `;

        const cursor = await db.query(query);
        return cursor.all()
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

    static async createComment(data) {
        const query = aql`
            INSERT {
                text: ${data.text}
            } INTO ${collections.Comments} OPTIONS { keyOptions: { type: "padded" } }
            LET newComment = NEW

            INSERT {
                _from: data.user_id,
                _to: NEW._id
            } INTO ${collections.UserComments} OPTIONS { keyOptions: { type: "padded" } }
            
            RETURN newComment
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async updateComment(comment_id, data) {
        // No Updates
        if (!data.text) {
            let query = aql`
                FOR comment IN ${collections.Comments}
                    FILTER comment._id == ${comment_id}
                    LIMIT 1
                    RETURN comment
            `;

            const cursor = await db.query(query);
            return cursor.all()
        }

        const updateValues = [];

        if (data.text !== undefined) {updateValues.push(aql`text: ${data.text}`)};

        let query = aql`
            LET key = PARSE_IDENTIFIER(${comment_id}).key
            UPDATE key
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Comments}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async deleteComment(comment_id) {
        let query = aql`
            LET key = PARSE_IDENTIFIER(${comment_id}).key
            REMOVE key
            IN ${collections.Comments}
            RETURN OLD
        `;

        const cursor = await db.query(query);
        return cursor.all()   
    }
}

export default CommentRepo;
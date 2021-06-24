import {default as db, collections } from '../db';
import { aql } from 'arangojs'

class CommentRepo {
    // Manually Checked - OK (6/10/2021)
    static async createComment(user_object, data) {
        const user_id = `${collections.Users.name}/${user_object.key}`
        const post_id = `${collections.Posts.name}/${data.post_key}`
        const query = aql`
            INSERT {
                text: ${data.text},
                createdAt: DATE_NOW(),
                updatedAt: DATE_NOW()
            } INTO ${collections.Comments} OPTIONS { keyOptions: { type: "padded" } }
            LET newComment = NEW

            INSERT {
                _from: ${user_id},
                _to: newComment._id
            } INTO ${collections.UserComments}
            
            INSERT {
                _from: ${post_id},
                _to: newComment._id
            } INTO ${collections.PostComments}

            RETURN newComment
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/8/2021)
    static async getAllComments(count = 10, offset = 0) {
        let query = aql`
            FOR comment IN ${collections.Comments}
                LIMIT ${offset}, ${count}
                RETURN comment
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getCommentByKey(comment_key) {
        let query = aql`
            FOR comment IN ${collections.Comments}
                FILTER comment._key == ${comment_key}
                LIMIT 1
                RETURN comment
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/10/2021)
    static async updateComment(comment_key, data) {
        const comment_id = `${collections.Posts.name}/${comment_key}`;

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

        updateValues.push(aql`updatedAt: DATE_NOW()`);

        let query = aql`
            UPDATE ${comment_key}
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Comments}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/10/2021)
    static async deleteComment(comment_key) {
        const comment_id = `${collections.Comments.name}/${comment_key}`;

        const query = aql`
            LET edgeKeys = (
                FOR v, e IN 1..1 ANY ${comment_id} GRAPH ${collections.commentRelationshipsGraph._name}
                RETURN e._key
            )
            
            LET r = (FOR edgeKey IN edgeKeys 
                REMOVE edgeKey IN ${collections.UserComments} OPTIONS { ignoreErrors: true }
                REMOVE edgeKey IN ${collections.PostComments} OPTIONS { ignoreErrors: true }
            ) 

            REMOVE ${comment_key}
            IN ${collections.Comments}
            RETURN OLD
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
}

export default CommentRepo;
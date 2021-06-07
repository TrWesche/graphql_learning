import db from '../db';
import { aql } from 'arangojs'

class CommentRepo {
    static async getAllComments() {
        let query = aql`
            FOR comment IN Comments
                LIMIT 100
                RETURN comment
        `;
        console.log(query);

        let result = await db.query(query);
        return result.next();
    }

    static async getCommentPost(comment_id) {
        let query = aql`
            FOR vertex IN INBOUND ${ comment_id } PostComments
                RETURN vertex
            `;
        let results = await db.query(query);
        return results.all();
    }

    static async getCommentAuthor(comment_id) {
        let query = aql`
            FOR vertex IN INBOUND ${ comment_id } UserPosts
                RETURN vertex
            `;
        let results = await db.query(query);
        return results.all();
    }
    

}

export default CommentRepo;
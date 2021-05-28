import db from '../db';
import { aql } from 'arangojs'

class PostRepo {
    static async getAllPosts() {
        let query = aql`
            FOR post IN posts
                LIMIT 100
                RETURN post
        `;
        console.log(query);

        let result = await db.query(query);
        return result.next();
    }

    static async getPostByID(post_id) {
        let query = aql`
            FOR post IN posts
                FILTER post._key == ${post_id}
                LIMIT 1
                RETURN post
        `;

        console.log(query);

        let result = await db.query(query);
    return result.next()
    }

    static async getPostComments(post_id) {
        let query = aql`
            FOR vertex IN OUTBOUND ${ post_id } post_comments
                RETURN vertex
        `;

        console.log(query);

        let results = await db.query(query);
        return results.all();
    }

    static async getPostAuthors(post_id) {
        let query = aql`
            FOR vertex IN INBOUND ${ post_id } user_posts
                RETURN vertex
        `;

        console.log(query);

        let results = await db.query(query);
        return results.all();
    }

    

}

export default PostRepo;
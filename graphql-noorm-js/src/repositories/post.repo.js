import {default as db, collections} from '../db';
import { aql } from 'arangojs'

class PostRepo {
    static async createPost(user_id, data) {
        const query = aql`
            INSERT {
                title: ${data.title},
                body: ${data.body},
                published: ${data.published ? data.published : false}
            } INTO ${collections.Posts} OPTIONS { keyOptions: { type: "padded" } }
            let newPost = NEW

            INSERT {
                _from: ${user_id},
                _to: NEW._id
            } INTO ${collections.UserPosts}
            RETURN newPost
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async getAllPosts() {
        const query = aql`
            FOR post IN ${collections.Posts}
                LIMIT 100
                RETURN post
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    static async getPostByID(data) {
        const query = aql`
            FOR post IN ${collections.Posts}
                FILTER post._id == ${data}
                LIMIT 1
                RETURN post
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async getFilteredPosts(publish_status, query) {
        const queryParams = [];

        if (publish_status !== undefined) {queryParams.push(aql`FILTER post.published === ${publish_status}`)};

        if (query !== undefined) {queryParams.push(aql`FILER LIKE(post.body, ${'%'+data.body+'%'}, true)`)};

        const query = aql`
            FOR post IN ${collections.Posts}
                ${aql.join(queryParams)}
                RETURN post
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async updatePost(post_id, data) {
        // No Updates
        if (!data.title && !data.body && !data.published) {
            const query = aql`
                FOR post IN ${collections.Posts}
                    FILTER post._id == ${post_id}
                    LIMIT 1
                    RETURN post
            `;

            const cursor = await db.query(query);
            return cursor.all()
        }

        const updateValues = [];

        if (data.title !== undefined) {updateValues.push(aql`title: ${data.title}`)};

        if (data.body !== undefined) {updateValues.push(aql`body: ${data.body}`)};

        if (data.published !== undefined) {updateValues.push(aql`published: ${data.published}`)};

        const query = aql`
            LET key = PARSE_IDENTIFIER(${post_id}).key
            UPDATE key
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Posts}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
 
    static async deletePost(post_id) {
        const query = aql`
            LET key = PARSE_IDENTIFIER(${post_id}).key
            REMOVE key
            IN ${collections.Posts}
            RETURN OLD
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async getPostComments(parent) {
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.PostComments}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    static async getPostAuthors(parent) {
        const query = aql`
            FOR v IN 1..1 INBOUND ${parent} ${collections.UserPosts}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
}

export default PostRepo;
import {default as db, collections} from '../db';
import { aql } from 'arangojs'

class PostRepo {
    // Manually Checked - OK (6/10/2021)
    static async createPost(author_id, data) {
        const fullAuthorID = `${collections.Users.name}/${author_id}`
        const query = aql`
            INSERT {
                title: ${data.title},
                body: ${data.body},
                published: ${data.published ? data.published : false}
            } INTO ${collections.Posts} OPTIONS { keyOptions: { type: "padded" } }
            LET newPost = NEW

            INSERT {
                _from: ${fullAuthorID},
                _to: newPost._id
            } INTO ${collections.UserPosts}
            RETURN newPost
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getAllPosts() {
        const query = aql`
            FOR post IN ${collections.Posts}
                LIMIT 100
                RETURN post
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
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

    // Manually Checked - OK (6/10/2021)
    static async getFilteredPosts(publishStatus, searchString) {
        const queryParams = [];

        if (publishStatus !== undefined) {queryParams.push(aql`FILTER post.published == ${publishStatus}`)};

        if (searchString !== undefined) {queryParams.push(aql`FILTER LIKE(post.body, ${'%'+searchString+'%'}, true)`)};

        const query = aql`
            FOR post IN ${collections.Posts}
                ${aql.join(queryParams)}
                RETURN post
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
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
 
    // Manually Checked - OK (6/10/2021)
    static async deletePost(post_id) {
        const query = aql`
            LET edgeKeys = (
                FOR v, e IN 1..1 ANY ${post_id} GRAPH ${collections.postRelationshipsGraph._name}
                RETURN e._key
            )
            
            LET r = (FOR edgeKey IN edgeKeys 
                REMOVE edgeKey IN ${collections.UserPosts} OPTIONS { ignoreErrors: true }
                REMOVE edgeKey IN ${collections.PostComments} OPTIONS { ignoreErrors: true }
            ) 

            LET key = PARSE_IDENTIFIER(${post_id}).key
            REMOVE key
            IN ${collections.Posts}
            RETURN OLD
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getPostComments(parent) {
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.PostComments}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
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
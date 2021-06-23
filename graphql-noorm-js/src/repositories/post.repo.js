import {default as db, collections} from '../db';
import { aql } from 'arangojs'

class PostRepo {
    // Manually Checked - OK (6/10/2021)
    static async createPost(user_object, data) {
        const user_id = `${collections.Users.name}/${user_object.key}`
        const query = aql`
            INSERT {
                title: ${data.title},
                body: ${data.body},
                published: ${data.published ? data.published : false}
            } INTO ${collections.Posts} OPTIONS { keyOptions: { type: "padded" } }
            LET newPost = NEW

            INSERT {
                _from: ${user_id},
                _to: newPost._id
            } INTO ${collections.UserPosts}
            RETURN newPost
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getPublicPosts(count = 10, offset = 0) {
        const query = aql`
            FOR post IN ${collections.Posts}
                FILTER post.published == TRUE
                LIMIT ${offset}, ${count}
                RETURN post
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getPostByKey(post_key) {
        const query = aql`
            FOR post IN ${collections.Posts}
                FILTER post._key == ${post_key}
                LIMIT 1
                RETURN post
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getFilteredPosts(searchString, author_key, post_key, published, count = 10, offset = 0) {
        const queryParams = [];

        if (searchString !== undefined) {queryParams.push(aql`FILTER LIKE(post.body, ${'%'+searchString+'%'}, true)`)};

        if (post_key !== undefined) {queryParams.push(aql`FILTER post._key == ${post_key}`)};

        if (published !== undefined) {queryParams.push(aql`FILTER post.published == ${published}`)};

        if (author_key !== undefined) {
            const author_id = `${collections.Users.name}/${author_key}`

            const query = aql`
            FOR post IN 1..1 OUTBOUND ${author_id} ${collections.UserPosts}
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN post
            `;

            const cursor = await db.query(query);
            return cursor.all();
        };

        const query = aql`
            FOR post IN ${collections.Posts}
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN post
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async updatePost(post_key, data) {
        // No Updates
        if (!data.title && !data.body && !data.published) {
            const query = aql`
                FOR post IN ${collections.Posts}
                    FILTER post._key == ${post_key}
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
            UPDATE ${post_key}
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Posts}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
 
    // Manually Checked - OK (6/10/2021)
    static async deletePost(post_key) {
        const post_id = `${collections.Posts.name}/${post_key}`
        const query = aql`
            LET edgeKeys = (
                FOR v, e IN 1..1 ANY ${post_id} GRAPH ${collections.postRelationshipsGraph._name}
                RETURN e._key
            )
            
            LET r = (FOR edgeKey IN edgeKeys 
                REMOVE edgeKey IN ${collections.UserPosts} OPTIONS { ignoreErrors: true }
                REMOVE edgeKey IN ${collections.PostComments} OPTIONS { ignoreErrors: true }
            ) 

            REMOVE ${post_key}
            IN ${collections.Posts}
            RETURN OLD
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getPostComments(parent, count = 10, offset = 0) {
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.PostComments}
                LIMIT ${offset}, ${count}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/10/2021)
    static async getPostAuthors(parent, count = 1, offset = 0) {
        const query = aql`
            FOR v IN 1..1 INBOUND ${parent} ${collections.UserPosts}
                LIMIT ${offset}, ${count}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
}

export default PostRepo;
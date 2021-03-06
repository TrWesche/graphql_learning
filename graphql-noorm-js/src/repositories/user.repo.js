import{ default as db, collections } from '../db';
import { aql } from 'arangojs'

class UserRepo {
    // Manually Checked - OK (6/7/2021)
    static async getAllUsers(count = 10, offset = 0, orderBy) {
        const queryParams = [];

        if (orderBy !== undefined) {
            const orderByParams = orderBy.split('_');
            queryParams.push(aql`SORT user.${orderByParams[0]} ${orderByParams[1]}`);
        }

        const query = aql`
            FOR user IN ${collections.Users}
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN user
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUsersByName(user_name, count = 10, offset = 0, orderBy) {
        const queryParams = [];

        if (orderBy !== undefined) {
            const orderByParams = orderBy.split('_');
            queryParams.push(aql`SORT user.${orderByParams[0]} ${orderByParams[1]}`);
        }
        
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER CONTAINS(LOWER(user.name), LOWER(${user_name}))
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByKey(user_key) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER user._key == ${user_key}
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByEmail(user_email) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER LOWER(user.email) == TRIM(LOWER(${user_email}))
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async createUser(data) {
        const query = aql`
            INSERT {
                name: ${data.name},
                email: TRIM(${data.email}),
                age: ${data.age ? data.age : null},
                password: ${data.password},
                createdAt: DATE_NOW(),
                updatedAt: DATE_NOW()
            } INTO ${collections.Users} OPTIONS { keyOptions: { type: "padded" } }
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - Updated Version (6/16/2021)
    static async updateUser(user_object, data) {
        // No Updates
        if (!data.name && !data.age && !data.email && !data.password) {
            const query = aql`
                FOR user IN ${collections.Users}
                    FILTER user._key == ${user_object.key}
                    LIMIT 1
                    RETURN user
            `;

            const cursor = await db.query(query);
            return cursor.all()
        }

        const updateValues = [];

        if (data.name !== undefined) {updateValues.push(aql`name: ${data.name}`)};

        if (data.age !== undefined) {updateValues.push(aql`age: ${data.age}`)};

        if (data.email !== undefined) {updateValues.push(aql`email: ${data.email}`)};

        if (data.password !== undefined) {updateValues.push(aql`password: ${data.password}`)};

        updateValues.push(aql`updatedAt: DATE_NOW()`);

        const query = aql`
            UPDATE ${user_object.key}
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Users}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
 
    // Manually Checked Updated Version - OK (6/17/2021)
    static async deleteUser(user_object) {
        const user_id = `${collections.Users.name}/${user_object.key}`
        // TODO: Almost working - still leaves some edges behind, does not cascade the delete to the comments made on a deleted post
        // the link between the removed comment and post is removed however.
        const query = aql`
            LET vertexKeys = (
                FOR v IN 1..1 OUTBOUND ${user_id} GRAPH ${collections.userRelationshipsGraph._name}
                RETURN v._id
            )
            LET allVerticies = APPEND([${user_id}],vertexKeys)
            RETURN (FOR vertex IN allVerticies RETURN PARSE_IDENTIFIER(vertex))
        `;
        const cursor = await db.query(query);
        const queryResult = await cursor.all();

        const vertexRemove = async (returnCollection = null, vertexCollections) => {
            const removedArray = [];
            for (const element of queryResult[0]) {
                for (const vertexCollection of vertexCollections) {
                    try {
                        if (vertexCollection._name === element.collection) {
                            // If there is a return collection type specified add removed elements from that collection to the return array
                            if (returnCollection && element.collection === returnCollection) {
                                const removedData = await vertexCollection.remove(element.key, {returnOld: true, waitForSync: true});
                                removedArray.push(removedData.old);
                            } else {
                                await vertexCollection.remove(element.key, {waitForSync: true});
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            };
            return removedArray;
        };

        const vertexCollections = await collections.userRelationshipsGraph.vertexCollections()
        const deletedUserArray = await vertexRemove("Users", vertexCollections);
        return deletedUserArray;
    }

    // Manually Checked - OK (6/8/2021)
    static async getUserPosts(parent, authenticated = false, count = 10, offset = 0, orderBy) {
        const queryParams = [];
        
        if (!authenticated) {queryParams.push(aql`FILTER v.published == TRUE`)};

        if (orderBy !== undefined) {
            const orderByParams = orderBy.split('_');
            queryParams.push(aql`SORT v.${orderByParams[0]} ${orderByParams[1]}`);
        }

        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserPosts}
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/8/2021)
    static async getUserComments(parent, count = 10, offset = 0, orderBy) {
        const queryParams = [];

        if (orderBy !== undefined) {
            const orderByParams = orderBy.split('_');
            queryParams.push(aql`SORT v.${orderByParams[0]} ${orderByParams[1]}`);
        }

        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserComments}
                ${aql.join(queryParams)}
                LIMIT ${offset}, ${count}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

}

export default UserRepo;
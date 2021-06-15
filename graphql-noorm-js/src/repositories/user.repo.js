import{ default as db, collections } from '../db';
import { aql } from 'arangojs'

class UserRepo {
    // Manually Checked - OK (6/7/2021)
    static async getAllUsers() {
        const query = aql`
            FOR user IN ${collections.Users}
                LIMIT 100
                RETURN user
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUsersByName(data) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER CONTAINS(LOWER(user.name), LOWER(${data}))
                LIMIT 100
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByID(data) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER user._id == ${data}
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByEmail(data) {
        const query = aql`
            FOR user IN ${collections.Users}
                FILTER LOWER(user.email) == TRIM(LOWER(${data}))
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
                age: ${data.age ? data.age : null}
            } INTO ${collections.Users} OPTIONS { keyOptions: { type: "padded" } }
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/7/2021)
    static async updateUser(user_id, data) {
        // No Updates
        if (!data.name && !data.age && !data.email) {
            const query = aql`
                FOR user IN ${collections.Users}
                    FILTER user._id == ${user_id}
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

        const query = aql`
            LET key = PARSE_IDENTIFIER(${user_id}).key
            UPDATE key
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Users}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }
 
    // Manually Checked - OK (6/7/2021)
    static async deleteUser(user_id) {
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
    static async getUserPosts(parent) {
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserPosts}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

    // Manually Checked - OK (6/8/2021)
    static async getUserComments(parent) {
        const query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserComments}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all();
    }

}

export default UserRepo;
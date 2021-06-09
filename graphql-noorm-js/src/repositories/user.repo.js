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
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER CONTAINS(LOWER(user.name), LOWER(${data}))
                LIMIT 100
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByID(data) {
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER user._id == ${data}
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/7/2021)
    static async getUserByEmail(data) {
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER LOWER(user.email) == TRIM(LOWER(${data}))
                LIMIT 1
                RETURN user
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/7/2021)
    static async createUser(data) {
        let query = aql`
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
            let query = aql`
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

        let query = aql`
            LET key = PARSE_IDENTIFIER(${user_id}).key
            UPDATE key
            WITH {${aql.join(updateValues, " ,")}}
            IN ${collections.Users}
            RETURN NEW
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }
 
    // Manually Checked - OK (6/7/2021)
    static async deleteUser(user_id) {
        let query = aql`
            LET key = PARSE_IDENTIFIER(${user_id}).key
            REMOVE key
            IN ${collections.Users}
            RETURN OLD
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/8/2021)
    static async getUserPosts(parent) {
        let query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserPosts}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

    // Manually Checked - OK (6/8/2021)
    static async getUserComments(parent) {
        let query = aql`
            FOR v IN 1..1 OUTBOUND ${parent} ${collections.UserComments}
                RETURN v
        `;

        const cursor = await db.query(query);
        return cursor.all()
    }

}

export default UserRepo;
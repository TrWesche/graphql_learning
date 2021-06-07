import{ default as db, collections } from '../db';
import { aql } from 'arangojs'

class UserRepo {
    static async getAllUsers() {
        const query = aql`
            FOR user IN ${collections.Users}
                LIMIT 100
                RETURN user
        `;

        const cursor = await db.query(query);
        return await cursor.all();
    }

    static async getUsersByName(user_name) {
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER CONTAINS(LOWER(user.name), LOWER(${user_name}))
                LIMIT 100
                RETURN user
        `;
    
        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async getUserByID(user_id) {
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER user._key == ${user_id}
                LIMIT 1
                RETURN user
        `;

        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async getUserByEmail(data) {
        let query = aql`
            FOR user IN ${collections.Users}
                FILTER LOWER(user.email) == TRIM(LOWER(${data.email}))
                LIMIT 1
                RETURN user
        `;

        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async createUser(data) {
        let query = aql`
            INSERT {
                name: ${data.name},
                email: TRIM(${data.email}),
                age: ${data.age ? data.age : null}
            } INTO ${collections.Users} OPTIONS { keyOptions: "padded" }
            RETURN NEW
        `;
        
        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async updateUser(data) {
        const updates = JSON.stringify(data);

        // Check to see what the JSON.stringify is creating to make sure it make sense
        console.log(updates);

        let query = aql`
            UPDATE 
                {_key: ${data.key}}
            WITH ${updates}
            IN ${collections.Users}
            RETURN NEW
        `;

        console.log(query);
        const cursor = await db.query(query);
        return cursor.all()
    }
 
    static async deleteUser(data) {
        let query = aql`
            REMOVE
                {_key: ${data.key}}
            IN ${collections.Users}
            RETURN OLD
        `;

        console.log(query);
        const cursor = await db.query(query);
        return cursor.all()
    }

    static async getUserPosts(user_id) {
        let query = aql`
            FOR vertex IN OUTBOUND ${user_id} ${collections.UserPosts}
                RETURN vertex
        `;

        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

    static async getUserComments(user_id) {
        let query = aql`
            FOR vertex IN OUTBOUND ${user_id} ${collections.UserComments}
                RETURN vertex
        `;

        console.log(query);

        const cursor = await db.query(query);
        return cursor.all()
    }

}

export default UserRepo;
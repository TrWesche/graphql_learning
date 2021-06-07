import db from '../db';
import { aql } from 'arangojs'

class UserRepo {
    static async getAllUsers() {
        const query = aql`
            FOR user IN Users
                LIMIT 100
                RETURN user
        `;
        console.log(query);

        const result = await db.query(query);

        return result.next();
    }

    static async getUsersByName(user_name) {
        let query = aql`
            FOR user IN Users
                FILTER CONTAINS(LOWER(user.name), LOWER(${user_name}))
                LIMIT 100
                RETURN user
        `;
    
        console.log(query);

        let result = await db.query(query);
        return result.next();
    }

    static async getUserByID(user_id) {
        let query = aql`
            FOR user IN Users
                FILTER user._key == ${user_id}
                LIMIT 1
                RETURN user
        `;

        console.log(query);

        let result = await db.query(query);
        return result.next()
    }

    static async getUserByEmail(data) {
        let query = aql`
            FOR user IN Users
                FILTER LOWER(user.email) == TRIM(LOWER(${data.email}))
                LIMIT 1
                RETURN user
        `;

        console.log(query);

        let result = await db.query(query);
        return result.next()
    }

    static async createUser(data) {
        let query = aql`
            INSERT {
                name: ${data.name},
                email: TRIM(${data.email}),
                age: ${data.age ? data.age : null}
            } INTO Users OPTIONS { keyOptions: "uuid" }
            RETURN NEW
        `;
        
        console.log(query);

        let result = await db.query(query);
        return result.next();
    }

    static async updateUser(data) {
        const updates = JSON.stringify(data);

        // Check to see what the JSON.stringify is creating to make sure it make sense
        console.log(updates);

        let query = aql`
            UPDATE 
                {_key: ${data.key}}
            WITH ${updates}
            IN Users
            RETURN NEW
        `;

        console.log(query);
        let result = await db.query(query);
        return result.next();
    }
 
    static async deleteUser(data) {
        let query = aql`
            REMOVE
                {_key: ${data.key}}
            IN Users
            RETURN OLD
        `;

        console.log(query);
        let result = await db.query(query);
        return result.next();
    }

    static async getUserPosts(user_id) {
        let query = aql`
            FOR vertex IN OUTBOUND ${ user_id } UserPosts
                RETURN vertex
        `;

        console.log(query);

        let results = await db.query(query);
        return results.all();
    }

    static async getUserComments(user_id) {
        let query = aql`
            FOR vertex IN OUTBOUND ${ user_id } UserComments
                RETURN vertex
        `;

        console.log(query);

        let results = await db.query(query);
        return results.all();
    }

}

export default UserRepo;
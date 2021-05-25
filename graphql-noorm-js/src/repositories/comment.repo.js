import db from '../db';
import { aql } from 'arangojs'

class CommentRepo {
    static async getPersonByName(name) {
        let query = aql`
            FOR person IN persons
                FILTER person.name == ${ name }
                LIMIT 1
                RETURN person
            `;
        let results = await db.query(query);
        return results.next();
    }

    
    

}

export default CommentRepo;
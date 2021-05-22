import { resolvers as userJoins } from './joins/user';
import { resolvers as postJoins } from './joins/post';
import { resolvers as commentJoins } from './joins/comment';


const joins = Object.assign(
    {}, 
    userJoins, 
    postJoins, 
    commentJoins
);

export default joins;
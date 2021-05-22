import { resolvers as userRead } from './queries/userRead';
import { resolvers as postRead } from './queries/postRead';
import { resolvers as commentRead } from './queries/commentRead';


const queries = Object.assign(
    {}, 
    userRead, 
    postRead, 
    commentRead
);

export default queries;
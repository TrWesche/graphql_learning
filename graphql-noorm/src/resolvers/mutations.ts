import { resolvers as userCxUD } from './mutations/userCxUD';
import { resolvers as postCxUD } from './mutations/postCxUD';
import { resolvers as commentCxUD } from './mutations/commentCxUD';


const mutations = Object.assign(
    {}, 
    userCxUD, 
    postCxUD, 
    commentCxUD
);

export default mutations;
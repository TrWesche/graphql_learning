import userCxUD from './mutations/userCxUD';
import postCxUD from './mutations/postCxUD';
import commentCxUD from './mutations/commentCxUD';

const mutations = Object.assign(
    {}, 
    userCxUD, 
    postCxUD, 
    commentCxUD
);

export default {Mutation: mutations};
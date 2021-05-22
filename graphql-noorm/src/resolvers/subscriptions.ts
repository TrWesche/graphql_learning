import { resolvers as commentSub } from './subscriptions/commentSub';
import { resolvers as postSub } from './subscriptions/postSub';


const subscriptions = Object.assign(
    {}, 
    commentSub, 
    postSub
);

export default subscriptions;
import commentSub from './subscriptions/commentSub';
import postSub from './subscriptions/postSub';


const subscriptions = Object.assign(
    {}, 
    commentSub, 
    postSub
);

export default {Subscription: subscriptions};
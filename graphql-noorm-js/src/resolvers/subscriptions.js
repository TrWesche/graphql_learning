import post from "./models/post";
import comment from "./models/comment";

// import commentSub from './subscriptions/commentSub';
// import postSub from './subscriptions/postSub';

const subscriptions = Object.assign(
    {}, 
    post.Subscription, 
    comment.Subscription
);

export default {Subscription: subscriptions};
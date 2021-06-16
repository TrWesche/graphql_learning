import post from "./models/post";
import comment from "./models/comment";

const subscriptions = Object.assign(
    {}, 
    post.Subscription, 
    comment.Subscription
);

export default {Subscription: subscriptions};
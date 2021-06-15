import user from "./models/user";
import post from "./models/post";
import comment from "./models/comment";

// import userJoins from './joins/user';
// import postJoins from './joins/post';
// import commentJoins from './joins/comment';

const joins = Object.assign(
    {}, 
    user.Field, 
    post.Field, 
    comment.Field
);

export default joins;
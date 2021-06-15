import user from "./models/user";
import post from "./models/post";
import comment from "./models/comment";

// import userRead from './queries/userRead';
// import postRead from './queries/postRead';
// import commentRead from './queries/commentRead';

const queries = Object.assign(
    {}, 
    user.Query, 
    post.Query, 
    comment.Query
);

export default {Query: queries};
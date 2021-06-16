import user from "./models/user";
import post from "./models/post";
import comment from "./models/comment";

const queries = Object.assign(
    {}, 
    user.Query, 
    post.Query, 
    comment.Query
);

export default {Query: queries};
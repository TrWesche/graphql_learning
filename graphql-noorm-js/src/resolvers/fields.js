import user from "./models/user";
import post from "./models/post";
import comment from "./models/comment";

const fields = Object.assign(
    {}, 
    user.Field, 
    post.Field, 
    comment.Field
);

export default fields;
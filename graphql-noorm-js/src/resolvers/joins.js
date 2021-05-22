import userJoins from './joins/user';
import postJoins from './joins/post';
import commentJoins from './joins/comment';


const joins = Object.assign(
    {}, 
    userJoins, 
    postJoins, 
    commentJoins
);

export default joins;
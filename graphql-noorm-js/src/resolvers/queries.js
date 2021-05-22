import userRead from './queries/userRead';
import postRead from './queries/postRead';
import commentRead from './queries/commentRead';

const queries = Object.assign(
    {}, 
    userRead, 
    postRead, 
    commentRead
);

export default {Query: queries};
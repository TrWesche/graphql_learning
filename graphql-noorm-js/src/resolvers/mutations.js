import authentication from "./models/authentication";
import user from "./models/user";
import post from "./models/post";
import comment from "./models/comment";

const mutations = Object.assign(
    {},
    authentication.Mutation,
    user.Mutation,
    post.Mutation,
    comment.Mutation
);

export default {Mutation: mutations};
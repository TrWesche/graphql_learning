import { makeExecutableSchema } from "graphql-tools";

// Import Models
import User from './models/user';
import Post from './models/post';
import Comment from './models/comment';

// Import Resolvers
import joins from './resolvers/joins';
import mutations from './resolvers/mutations';
import queries from './resolvers/queries';
import subscriptions from './resolvers/subscriptions';

// Import Connectors



const schema = makeExecutableSchema({
    typeDefs: [User, Post, Comment],
    resolvers: Object.assign({}, joins, mutations, queries, subscriptions)
});

export default schema;
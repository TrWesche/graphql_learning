import { makeExecutableSchema } from "graphql-tools";

// Import Models
import Queries from './schemas/_queries';
import Mutations from './schemas/_mutations';
import Subscriptions from './schemas/_subscriptions';
import Enumerations from './schemas/_enumerations';
import User from './schemas/user';
import Post from './schemas/post';
import Comment from './schemas/comment';

// Import Resolvers
import joinResolvers from './resolvers/joins';
import mutationResolvers from './resolvers/mutations';
import queryResolvers from './resolvers/queries';
import subscriptionResolvers from './resolvers/subscriptions';

// Import Connectors

// console.log(queryResolvers)

const schema = makeExecutableSchema({
    typeDefs: [
        Queries, 
        Mutations, 
        Subscriptions, 
        Enumerations, 
        User, 
        Post, 
        Comment],
    resolvers: Object.assign({}, 
        joinResolvers, 
        mutationResolvers, 
        queryResolvers, 
        subscriptionResolvers),
});

export default schema;
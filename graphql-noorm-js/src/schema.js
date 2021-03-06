import { makeExecutableSchema } from "graphql-tools";
import { mergeTypeDefs }  from '@graphql-tools/merge';

// Import Models
import Types from './schemas/_types';
import Queries from './schemas/_queries';
import Mutations from './schemas/_mutations';
import Subscriptions from './schemas/_subscriptions';
import Enumerations from './schemas/_enumerations';
import User from './schemas/user';
import Post from './schemas/post';
import Comment from './schemas/comment';

const types = mergeTypeDefs([
    Types,
    Queries, 
    Mutations, 
    Subscriptions, 
    Enumerations, 
    User, 
    Post, 
    Comment]
);

// Import Resolvers
import typeResolvers from './resolvers/types';
import fieldResolvers from './resolvers/fields';
import mutationResolvers from './resolvers/mutations';
import queryResolvers from './resolvers/queries';
import subscriptionResolvers from './resolvers/subscriptions';

// Import Connectors


const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers: Object.assign({},
        typeResolvers,
        fieldResolvers, 
        mutationResolvers, 
        queryResolvers, 
        subscriptionResolvers),
});

export default schema;
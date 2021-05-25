// https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { execute, subscribe } = require('graphql');

const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');

import schema from './schema';
import UserRepo from './repositories/user.repo';
import CommentRepo from './repositories/comment.repo';

const app = express();
const pubsub = new PubSub();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: { 
      UserRepo, 
      CommentRepo,
      pubsub }
}));

const server = app.listen(4000, () => {
  console.log(`\
    🚀 Server ready at on port 4000
  `);
});

SubscriptionServer.create({ schema, execute, subscribe }, {
  server
});
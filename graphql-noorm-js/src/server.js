// https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { execute, subscribe } = require('graphql');

const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');

import { processJWT } from './middleware/auth';

import schema from './schema';
import UserRepo from './repositories/user.repo';
import PostRepo from './repositories/post.repo';
import CommentRepo from './repositories/comment.repo';

const app = express();
const pubsub = new PubSub();

const decodedPayload = {
  user: function (args, req) {
    return req.user;
  }
}

app.use(processJWT);
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: decodedPayload,
    graphiql: true,
    context: { 
      UserRepo,
      PostRepo,
      CommentRepo,
      pubsub
    }
}));

const server = app.listen(4000, () => {
  console.log(`\
    🚀 Server ready at on port 4000
  `);
});

SubscriptionServer.create({ schema, execute, subscribe }, {
  server
});
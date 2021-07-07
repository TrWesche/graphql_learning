// https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { graphqlHTTP } from "express-graphql";
import { execute, subscribe } from "graphql";

const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');

import { PORT } from './config';
import { processJWT } from './middleware/auth';

import schema from './schema';
import UserRepo from './repositories/user.repo';
import PostRepo from './repositories/post.repo';
import CommentRepo from './repositories/comment.repo';
import AuthorizationRepo from './repositories/authorization.repo';

const app = express();
const pubsub = new PubSub();

// let decodedPayload = {
//   user: function (args, req) {
//     return req.user;
//   }
// }

app.use(cors({
  credentials: true,
  origin: `http://localhost:${PORT}`
}));
app.use(cookieParser());
app.use(processJWT);
app.use(
  '/graphql',
  graphqlHTTP((request, response, graphQLParams) => ({
    schema: schema,
    rootValue: request,
    graphiql: true,
    context: { 
      AuthorizationRepo,
      UserRepo,
      PostRepo,
      CommentRepo,
      pubsub,
      response
    }
  }))
);

const server = app.listen(PORT, () => {
  console.log(`\
    🚀 Server ready at on port ${PORT}
  `);
});

SubscriptionServer.create({ schema, execute, subscribe }, {
  server
});

export default app;
import { Database } from 'arangojs';
import { ARANGODB_ADDRESS, ARANGODB_NAME, ARANGODB_USER, ARANGODB_PASSWORD } from './config';

const db = new Database({
  url: ARANGODB_ADDRESS,
  databaseName: ARANGODB_NAME,
  auth: {username: ARANGODB_USER, password: ARANGODB_PASSWORD}
})

// Define Database Collections
// Document Collections
const collections = {
  // Document Collections
  Users: db.collection("Users"),
  Posts: db.collection("Posts"),
  Comments: db.collection("Comments"),
  // Edge Collections
  UserPosts: db.collection("UserPosts"),
  UserComments: db.collection("UserComments"),
  PostComments: db.collection("PostComments"),
  // Graphs
  postRelationshipsGraph: db.graph("postRelationshipsGraph"),
  commentRelationshipsGraph: db.graph("commentRelationshipsGraph"),
  userRelationshipsGraph: db.graph("userRelationshipsGraph")
}

export {
  db as default,
  collections
}
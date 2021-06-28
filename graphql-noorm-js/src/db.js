import { Database } from 'arangojs';
import { ARANGODB_ADDRESS, ARANGODB_NAME, ARANGODB_USER, ARANGODB_PASSWORD } from './config';

console.log(`
  Connecting to Database:
  Address: ${ARANGODB_ADDRESS}
  Database Name: ${ARANGODB_NAME}
  Database User: ${ARANGODB_USER}
  Database Password: ${ARANGODB_PASSWORD}
`)

const db = new Database({
  url: ARANGODB_ADDRESS,
  databaseName: ARANGODB_NAME,
  auth: {username: ARANGODB_USER, password: ARANGODB_PASSWORD}
})

// console.log(`
//   Database Connected:
//   Version: ${db.version()}
//   Attempting Login:
//   ${db.login(ARANGODB_USER, ARANGODB_PASSWORD)}
// `)

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
//src/database.js
import { Database } from 'arangojs'
// import dotenv from 'dotenv'

// dotenv.config();

// console.log(process.env.ARANGODB_ADDRESS);
// console.log(process.cwd());

// TODO: Fixt The Environment variable based version of this
// Create Database
// const db = new Database({
//   url: process.env.ARANGODB_ADDRESS,
//   databaseName: process.env.ARANGODB_NAME,
//   auth: {username: process.env.ARANGODB_USER, password: process.env.ARANGODB_PASSWORD}
// })

const db = new Database({
  url: "http://127.0.0.1:1234/",
  databaseName: "GRAPHQL_LRN",
  auth: {username: "root", password: "graphqlandarangodb"}
})

db.graph
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
  commentRelationshipsGraph: db.graph("commentRelationshipsGraph")
}


export {
  db as default,
  collections
}
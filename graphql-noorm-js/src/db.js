//src/database.js
import { Database } from 'arangojs'
 
export const db = new Database({
  url: process.env.ARANGODB_ADDRESS,
  databaseName: process.env.ARANGODB_NAME,
  auth: {username: process.env.ARANGODB_USER, password: process.env.ARANGODB_PASSWORD}
})
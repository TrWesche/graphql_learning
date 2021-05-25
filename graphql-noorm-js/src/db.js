//src/database.js
import arangojs from 'arangojs'
 
export const db = arangojs({
  url: `http://${process.env.ARANGODB_USER}:${process.env.ARANGODB_PASSWORD}@${process.env.ARANGODB_ADDRESS}`,
  databaseName: 'graphql_lrn'
})
/* istanbul ignore file */

// npm packages
const request = require("supertest");
const bcrypt = require("bcrypt");

// app imports
const app = require("../../lib/server");
const db = require("../../lib/db");
const {arangojs, aql} = require("arangojs")


// Base User Document Data
const USER_DOCUMENTS = [
    {_key: '1', name: 'Trent', email: 'trent@example.com', age: 32, password: $2b$12$97PJclCMtof97KknsR.myuzP3KtmRUK7Mx8sFG1oxMFUPnLy2SwTu, createdAt: 1624831262, updatedAt: 1624831262},
    {_key: '2', name: 'Camille', email: 'camille@example.com', password: $2b$12$97PJclCMtof97KknsR.myuzP3KtmRUK7Mx8sFG1oxMFUPnLy2SwTu, createdAt: 1624831280, updatedAt: 1624831280},
    {_key: '3', name: 'Zoltar', email: 'zoltar@example.com', age: 1000, password: $2b$12$97PJclCMtof97KknsR.myuzP3KtmRUK7Mx8sFG1oxMFUPnLy2SwTu, createdAt: 1604831262, updatedAt: 1624831312}
];

// Base Post Document Data
const POST_DOCUMENTS = [
    {_key: '1', title: 'My First Post', body: 'Body of the first post', published: true, createdAt: 1624831331, updatedAt: 1624831331},
    {_key: '2', title: 'My Second Post', body: 'Body of the second post', published: true, createdAt: 1624831280, updatedAt: 1624831331},
    {_key: '3', title: 'My Third Post', body: 'Body of the third post', published: false, createdAt: 1624831331, updatedAt: 1624831331},
    {_key: '4', title: 'My Fourth Upload', body: 'This is the text for the fourth upload', published: true, createdAt: 1624831393, updatedAt: 1624831400}
];

// Base Comment Document Data
const COMMENT_DOCUMENTS = [
    {_key: '1', text: 'This is the first comment on post 1 - comment1', createdAt: 1624831331, updatedAt: 1624831331},
    {_key: '2', text: 'This is the second comment on post 1 - comment2', createdAt: 1624831321, updatedAt: 1624831466},
    {_key: '3', text: 'This is the first comment on post 3 - comment3', createdAt: 1624831131, updatedAt: 1624831331},
    {_key: '4', text: 'This is the first comment on post 4 - comment4', createdAt: 1624831331, updatedAt: 1624831490}
];

// Base User Post Edge Data
const USER_POST_EDGES = [
    {_from: 'Users/1', _to: 'Posts/1', active: true},
    {_from: 'Users/2', _to: 'Posts/2', active: true},
    {_from: 'Users/1', _to: 'Posts/3', active: true},
    {_from: 'Users/3', _to: 'Posts/4', active: true}
];

// Base User Comment Edge Data
const USER_COMMENT_EDGES = [
    {_from: 'Users/2', _to: 'Comments/1', active: true}, 
    {_from: 'Users/3', _to: 'Comments/2', active: true}, 
    {_from: 'Users/2', _to: 'Comments/3', active: true}, 
    {_from: 'Users/1', _to: 'Comments/4', active: true}
];

// Base Post Comment Edge Data
const POST_COMMENT_EDGES = [
    {_from: 'Posts/1', _to: 'Comments/1', active: true},
    {_from: 'Posts/1', _to: 'Comments/2', active: true},
    {_from: 'Posts/3', _to: 'Comments/3', active: true},
    {_from: 'Posts/4', _to: 'Comments/4', active: true}
];

// Source Data for Tests
const MUTATION_DATA = {
    testUser1: {name: 'TestUser1', email: 'TestUser1@example.com', age: 32},
    testUser2: {name: 'TestUser2', email: 'TestUser2@example.com'},
    testPost1: {title: 'My Test Post - 1', body: 'Body of Test Post 1', published: true},
    testPost2: {title: 'My Test Post - 2', body: 'Body of Test Post 2', published: true},
    testComment1: {text: 'This is the first test comment - test comment 1'},
    testComment2: {text: 'This is the second test comment - test comment 2'}
}


const TEST_DATA = {};

async function beforeAllHook() {
    const testdb = await db.createDatabase("testdb", {
        users: [{ username: "testAdmin" }]
    });
    db.useDatabase("testdb"); 
    db.useBasicAuth("testAdmin", "");

    // Create Document Collections
    const userCollection = await db.createCollection("Users");
    const postCollection = await db.createCollection("Posts");
    const commentCollection = await db.createCollection("Comments");

    // Create Edge Collections
    const userPosts = await db.createEdgeCollection("UserPosts");
    const userComments = await db.createEdgeCollection("UserComments");
    const postComments = await db.createEdgeCollection("PostComments");

    // Create Graphs
    const userRelationshipsGraph = await db.createGraph("userRelationshipsGraph", [
        {"collection": "UserPosts", from: ["Users"], to: ["Posts"]},
        {"collection": "UserComments", from: ["Users"], to: ["Comments"]}
    ]);
    const postRelationshipsGraph = await db.createGraph("postRelationshipsGraph", [
        {"collection": "UserPosts", from: ["Users"], to: ["Posts"]},
        {"collection": "PostComments", from: ["Posts"], to: ["Comments"]}
    ]);
    const commentRelationshipsGraph = await db.createGraph("commentRelationshipsGraph", [
        {"collection": "PostComments", from: ["Posts"], to: ["Comments"]},
        {"collection": "UserComments", from: ["Users"], to: ["Comments"]}
    ]);
}

/**
 * Hooks to insert a user, comment, and post, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
    try {
        // Connect to Test Database and Set Context
        db.useDatabase("testdb"); 
        db.useBasicAuth("testAdmin", "");

        // Remove all Data from Collections
        await db.query(aql`
            FOR x in Users
            REMOVE x in Users
        `)

        await db.query(aql`
            FOR x in Posts
            REMOVE x in Posts
        `)

        await db.query(aql`
            FOR x in Comments
            REMOVE x in Comments
        `)
        
        await db.query(aql`
            FOR x in UserPosts
            REMOVE x in UserPosts
        `)

        await db.query(aql`
            FOR x in UserComments
            REMOVE x in UserComments
        `)

        await db.query(aql`
            FOR x in PostComments
            REMOVE x in PostComments
        `)

        // Create all Default Documents
        const resultUserCollection = await userCollection.saveAll(
            USER_DOCUMENTS,
            { returnNew: true }
        );
        const resultPostCollection = await postCollection.saveAll(
            POST_DOCUMENTS,
            { returnNew: true }
        );
        const resultCommentCollection = await commentCollection.saveAll(
            COMMENT_DOCUMENTS,
            { returnNew: true }
        );

        // Create all Default Edges
        const userPostsEdge = await userPosts.saveAll(
            USER_POST_EDGES,
            { returnNew: true }
        );
        const userCommentsEdge = await userComments.saveAll(
            USER_COMMENT_EDGES,
            { returnNew: true }
        );
        const postCommentsEdge = await postComments.saveAll(
            POST_COMMENT_EDGES,
            { returnNew: true }
        );
    } catch (error) {
        console.error(error);
    }
}

async function afterEachHook() {
    try {

    } catch (error) {
        console.error(error);
    }
}

async function afterAllHook() {
    try {
        // await db.dropDatabase("testdb");
        // await db.end();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    USER_DOCUMENTS, 
    POST_DOCUMENTS,
    COMMENT_DOCUMENTS,
    USER_POST_EDGES,
    USER_COMMENT_EDGES,
    POST_COMMENT_EDGES,
    MUTATION_DATA,
    beforeAllHook,
    beforeEachHook,
    afterEachHook,
    afterAllHook,
    TEST_DATA
}
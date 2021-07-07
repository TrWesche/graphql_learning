// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken")

// app imports
const app = require("../../lib/server");
const db = require("../../lib/db");

// model imports


// config imports
const {
    USER_DOCUMENTS,
    MUTATION_DATA,
    beforeAllHook,
    beforeEachHook,
    afterEachHook,
    afterAllHook,
    TEST_DATA
} = require("../config/config");



beforeAll(async function () {
    await beforeAllHook();
});

beforeEach(async function () {
    await beforeEachHook(TEST_DATA);
});

afterEach(async function () {
    await afterEachHook();
})

afterAll(async function() {
    await afterAllHook();
});


// User Authentication   
describe("POST /graphql -- User Authentication Endpoints", () => {
    // Test 1 - Successful Authentication (full end-to-end)
    test("Can Login", async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                email: USER_DOCUMENTS[0].email, 
                password: USER_DOCUMENTS[0].password
        });

        expect(res.body.data.key).toBe(USER_DOCUMENTS[0]._key);
        expect(res.body.data.name).toBe(USER_DOCUMENTS[0].name);
        expect(res.statusCode).toBe(200);
    })

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    test("Fails Login on Missing  Username/Password", async () => {
        const res = await request(app)
        .post('/graphql')
        .send({
            email: USER_DOCUMENTS[0].email
        });

        expect(res.body.errors[0].message).toBe(`Invalid Email/Password.`);
        expect(res.statusCode).toBe(500);
    })

    // Test 3 - Incorrect Password - Should be caught by model
    test("Fails Login on Incorrect Username/Password Combination", async () => {
        const res = await request(app)
        .post('/graphql')
        .send({
            email: USER_DOCUMENTS[0].email, 
            password: "incorrectpassword"
        });

        expect(res.body.errors[0].message).toBe(`Invalid Email/Password.`);
        expect(res.statusCode).toBe(500);
    })

    // Test 4 - Incorrect email format - Should be Caught by Schema
    test("Fails Login on Incorrect Email Format", async () => {
        const incorrectEmail = USER_DOCUMENTS[0].email.replace(".com","");

        const res = await request(app)
        .post('/graphql')
        .send({
            email: incorrectEmail, 
            password: USER_DOCUMENTS[0].password
        });

        expect(res.body.errors[0].message).toBe(`Invalid Email/Password.`);
        expect(res.statusCode).toBe(500);
    })
});

import { GraphQLServer } from "graphql-yoga";

// Scalar Types: String, Boolean, Int, Float, ID
// Exclamation Point means it cannot be null

// Type Definitions (Schema)


// const typeDefs = `
//     type Query {
//         hello: String!
//         name: String!
//         location: String!
//         bio: String!
//     }
// `

// Resolvers
// const resolvers = {
//     Query: {
//         hello() {
//             return "This is my first query!"
//         },
//         name() {
//             return "Trenton W"
//         },
//         location() {
//             return "St Louis, MO"
//         },
//         bio() {
//             return "It's a bit crazy how many different this I try to do.  Business, electical engineering, software engineering, and who knows what else.  Never stop learning ;)."
//         }
//     }
// }

// const typeDefs = `
//     type Query {
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float
//     }
// `

// const resolvers = {
//     Query: {
//         id() {
//             return 'abc123'
//         },
//         name() {
//             return 'Trenton'
//         },
//         age() {
//             return 32
//         },
//         employed() {
//             return true
//         },
//         gpa() {
//             return null
//         }
//     }
// }

// const typeDefs = `
// type Query {
//     id: ID!
//     title: String!
//     price: Float!
//     releaseYear: Int
//     rating: Float
//     inStock: Boolean!
//     review: String!
// } `

// const resolvers = {
//     Query: {
//         id() {
//             return 'abc123'
//         },
//         title() {
//             return 'Trenton'
//         },
//         price() {
//             return 12.98
//         },
//         releaseYear() {
//             return null
//         },
//         rating() {
//             return 4.21
//         },
//         inStock() {
//             return true
//         },
//         review() {
//             return 'Its a box!'
//         }
//     }
// }


const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(val1: Float!, val2: Float!): Float!
        sumArray(numbers: [Float!]!): Float!
        grades: [Int!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            // console.log(args);
            if (args.name && args.position) {
                return `Hello ${args.name}!  You're the best ${args.position}`
            } 
            
            if (args.name) {
                return `Hello ${args.name}.`
            }

            return 'Hello!'
        },
        add(parent, args, ctx, info) {
            return args.val1 + args.val2;
        },
        sumArray(parent, args, ctx, info){
            if (args.numbers.length === 0) {
                return 0;
            }

            return args.numbers.reduce((acc, val) => {
                return acc + val;
            }, 0);
        },
        grades(parent, args, ctx, info) {
            return [75, 88, 98]
        },
        me() {
            return {
                id: '12345',
                name: 'Mike',
                email: 'mike@fakeprovider.com',
                // age: 45 // This will result in null being returned for age
            }
        },
        post() {
            return {
                id: 'ABCPOSTID',
                title: 'My First Post',
                body: 'GraphQL is pretty cool',
                published: true
            }
        }
    }
}

// const server = new GraphQLServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers
// });

// The version below will work because the variable names match the expected inputs of the GraphQLServer
const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log("Server Start Successful")
})
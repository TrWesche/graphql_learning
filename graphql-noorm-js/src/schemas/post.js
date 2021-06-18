import gql from 'graphql-tag';

const typedef = gql`
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
    }

    input UpdatePostInput {
        title: String
        body: String
        published: Boolean
    }

    type Post {
        _id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
`;

export default typedef;
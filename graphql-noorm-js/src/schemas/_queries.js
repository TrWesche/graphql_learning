import gql from 'graphql-tag';

const typedef = gql`
    type Query {
        users(query: String, id: ID, email: String): [User!]!
        posts(query: String, publish_status: Boolean): [Post!]!
        comments: [Comment!]!
    }
`;

export default typedef;
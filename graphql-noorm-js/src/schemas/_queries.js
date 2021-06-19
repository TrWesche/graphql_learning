import gql from 'graphql-tag';

const typedef = gql`
    type Query {
        users(query: String, key: ID, email: String): [User!]!
        posts(query: String, author_key: ID, post_key: ID): [Post!]!
        postsPrivate(query: String, post_key: ID, published: Boolean): [Post!]!
        comments: [Comment!]!
    }
`;

export default typedef;
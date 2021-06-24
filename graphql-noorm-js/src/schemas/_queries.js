import gql from 'graphql-tag';

const typedef = gql`
    type Query {
        users(query: String, key: ID, count: Int, offset: Int): [UserPublic!]!
        userPrivate: UserPrivate!
        posts(query: String, author_key: ID, post_key: ID, count: Int, offset: Int, orderBy: PostOrderByInput): [Post!]!
        postsPrivate(query: String, post_key: ID, published: Boolean, count: Int, offset: Int, orderBy: PostOrderByInput): [Post!]!
        comments(count: Int, offset: Int): [Comment!]!
    }
`;

export default typedef;
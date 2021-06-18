import gql from 'graphql-tag';

const typedef = gql`
    input CreateCommentInput {
        text: String!
        post_key: ID!
    }

    input UpdateCommentInput {
        text: String
    }

    type Comment {
        _key: ID!
        text: String!
        author: User!
        post: Post
    }
`;

export default typedef;
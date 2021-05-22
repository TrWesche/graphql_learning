import gql from 'graphql-tag';

const typedef = gql`
    input CreateCommentInput {
        text: String!
        author_id: ID!
        post_id: ID!
    }

    input UpdateCommentInput {
        text: String
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

export default typedef;
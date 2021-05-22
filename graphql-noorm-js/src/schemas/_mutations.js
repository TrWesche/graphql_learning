import gql from 'graphql-tag';

const typedef = gql`
    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(user_id: ID!): User!
        updateUser(user_id: ID!, data: UpdateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        updatePost(post_id: ID!, data: UpdatePostInput!): Post!
        deletePost(post_id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        updateComment(comment_id: ID!, data: UpdateCommentInput!): Comment!
        deleteComment(comment_id: ID!): Comment!
    }
`;

export default typedef;
import gql from 'graphql-tag';

const typedef = gql`
    enum MutationType {
        CREATED
        UPDATED
        DELETED
    }
`;

export default typedef;
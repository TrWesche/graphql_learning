import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const Types = {
  TimeStampUnix: new GraphQLScalarType({
    name: 'TimeStampUnix',
    description: 'Date Time Stamp Unix - Unix time counts all non leap seconds beginning with January 1st 1970 00:00:00.000 UTC, also know as the Unix epoch.',
    parseValue(value) {
      // Value sent from Client to Database
      return new Date(value).getTime(); // value from the client -> Time should be a Unix time integer value.
    },
    serialize(value) {
      // Value returned from Database to client.
      return value; // Time should already be stored as an Unix time integer.
      // return new Date(value).getTime(); //In case want to return human readable version.
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
};

export default Types;
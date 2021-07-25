import { gql } from "apollo-server-express";

export default gql`
  type DataStatus {
    message: String!
    value: Boolean!
    data: Course
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: Date!
  }
`;

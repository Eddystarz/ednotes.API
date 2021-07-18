import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    Fetch single course
    """
    get_single_topic(topicId: ID!): DataStatus
    get_all_topics(cursor: String, limit: Int): TopicConnection!
  }

  extend type Mutation {
    createTopic(
      course: ID

      name: String

      description: String

    ): DataStatus

    editTopic(
      topicId: ID!
      name: String
      description: String
    ): DataStatus

    """
    "At no point is the deleted news data returned in this request
    """
    deleteTopic(topicId: ID!): DataStatus
  }

  type Topic {
    _id: ID!
  
    course: Course

    name: String

    description: String

  }

  type TopicConnection {
    edges: [Topic!]!
    pageInfo: PageInfo
  }
`;
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    get_single_note(noteId: ID!): LectureNoteStatus

    """
    Get notes belonging to a coursetopic
    """
    get_topic_notes(
      cursor: String
      limit: Int
      topicId: ID!
    ): LectureNoteConnection!
  }

  extend type Mutation {
    createLectureNote(
      course: ID!

      courseTopic: ID!

      name: String

      text: String
    ): LectureNoteStatus

    updateNote(noteId: ID!, text: String, name: String): LectureNoteStatus

    deleteNote(noteId: ID!): LectureNoteStatus
  }

  type LectureNote {
    _id: ID!

    course: Course!

    courseTopic: Topic!

    name: String!

    text: String!
  }

  type LectureNoteStatus {
    message: String!
    value: Boolean!
    note: LectureNote
  }

  type LectureNoteConnection {
    edges: [LectureNote!]!
    pageInfo: PageInfo
  }
`;

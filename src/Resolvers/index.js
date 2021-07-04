import { GraphQLDateTime } from "graphql-iso-date";

// ========= Resolvers ========//
import userResolver from "./user";
import schoolResolver from "./school";
import facultyResolver from "./faculty";
import deptResolver from "./dept";
import levelResolver from "./level";
import studentResolver from "./student";
import newsResolver from "./news";
import storyResolver from "./edstory";
import courseResolver from "./course"
import topicResolver from "./course_topic"
// import lectureNoteResolver from "./lecture_note"

const customDateScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  userResolver,
  schoolResolver,
  facultyResolver,
  deptResolver,
  levelResolver,
  studentResolver,
  newsResolver,
  storyResolver,
  courseResolver,
  topicResolver,
  // lectureNoteResolver,
  customDateScalarResolver
];

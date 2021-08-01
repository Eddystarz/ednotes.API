import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import LectureNote from "../database/Models/lecture_notes";
import CourseTopic from "../database/Models/course_topic";
import Course from "../database/Models/course";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";
import { processUpload } from "../helper/file_uploads";

export default {
  Query: {
    get_topic_notes: async (_, { cursor, limit, topicId }) => {
      try {
        let notes;

        if (cursor) {
          notes = await LectureNote.find({
            courseTopic: topicId,
            createdAt: { $lt: cursor }
          })
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          if (notes.length === 0) {
            return {
              edges: notes
            };
          } else if (notes.length > 0) {
            const hasNextPage = notes.length > limit;
            const edges = hasNextPage ? notes.slice(0, -1) : notes;

            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: edges[edges.length - 1].createdAt
              }
            };
          }
        } else {
          notes = await LectureNote.find({ courseTopic: topicId })
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          console.log("NOTES");
          console.log(notes);

          if (notes.length === 0) {
            return {
              edges: notes
            };
          } else if (notes.length > 0) {
            const hasNextPage = notes.length > limit;
            const edges = hasNextPage ? notes.slice(0, -1) : notes;
            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: edges[edges.length - 1].createdAt
              }
            };
          }
        }
        throw new ApolloError(
          "Something went wrong while trying to fetch notes"
        );
      } catch (error) {
        throw error;
      }
    },

    get_single_note: combineResolvers(
      isAuthenticated,
      async (_, { noteId }) => {
        try {
          const note = await LectureNote.findById(noteId);

          if (!note) {
            return {
              message: "Note not found",
              value: false
            };
          }

          return {
            message: "Data found",
            value: true,
            note
          };
        } catch (error) {
          throw error;
        }
      }
    )
  },

  Mutation: {
    createLectureNote: combineResolvers(isAdmin, async (_, args) => {
      try {
        const newNote = new LectureNote({
          ...args
        });

        const savedNote = await newNote.save();

        return {
          message: "Lecture note created successfully",
          value: true,
          note: savedNote
        };
      } catch (error) {
        throw error;
      }
    }),

    updateNote: combineResolvers(isAdmin, async (_, args) => {
      try {
        const updatedNote = await LectureNote.findByIdAndUpdate(
          args.topicId,
          args,
          {
            new: true
          }
        );

        return {
          message: "Note updated successfully",
          value: true,
          note: updatedNote
        };
      } catch (error) {
        throw error;
      }
    }),

    deleteNote: combineResolvers(isAdmin, async (_, { noteId }) => {
      try {
        await LectureNote.findByIdAndRemove(noteId);

        return {
          message: "Note deleted successfully",
          value: true
        };
      } catch (error) {
        throw error;
      }
    }),

    test: async (_, { file }) => {
      try {
        // const filePromise = await file;
        // console.log(filePromise);
        const uploadData = await processUpload(file);

        console.log(uploadData);
        // if (filePromise.mimetype.includes("pdf")) {
        //   console.log("Na PDF File");
        // }

        return true;
      } catch (error) {
        throw error;
      }
    }
  },

  // Type relations to get data for other types when quering for lecture notes
  LectureNote: {
    course: (_) => Course.findById(_.course),
    courseTopic: (_) => CourseTopic.findById(_.courseTopic)
  }
};

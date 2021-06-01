import { skip } from "graphql-resolvers";
import User from "../../database/Models/user";

export const isAuthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error("Access Denied!Please login to continue");
  }
  return skip;
};

export const isAdmin = async (_, __, { loggedInUserId }) => {
  try {
    const user = await User.findOne({ _id: loggedInUserId });
    if (user.isAdmin !== true) {
      throw new Error("Not Authorized to perform this action");
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isSuperAdmin = async (_, __, { loggedInUserId }) => {
  try {
    const user = await User.findOne({ _id: loggedInUserId });
    if (user.isSuperAdmin !== true && user.isAdmin !== true) {
      throw new Error("Not Authorized to perform this action");
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// module.exports.isTaskOwner = async (_,{ id }, {loggedInUserId}) => {
//     try {
//         if(!isValidObjectId(id)){
//             throw new Error('Invalid Task id')
//         }
//         const task = await Task.findById(id)
// if (!task){
//     throw new Error('Task not found')
// }else if (task.user.toString() !== loggedInUserId){
//     throw new Error('Not authorized as task owner')
// }
// return skip
//     } catch (error) {
//         console.log(error)
//         throw error
//     }

// }

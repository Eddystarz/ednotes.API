import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    Fetch single news
    """
    get_single_news(newsId: ID!): News
  }

  extend type Mutation {
    createNews(
      headline: String!
      content: String!
      file: Upload
      """
      this value MUST be either "school", "dept", "faculty" depending on who the news
      was created for
      """
      category: String!
      """
      if the category field is not "school" this field should be null
      """
      school: ID
      """
      if the category field is not "faculty" this field should be null
      """
      faculty: ID
      """
      if the category field is not "dept" this field should be null
      """
      dept: ID
    ): NewsStatus
  }

  type NewsStatus {
    message: String!
    value: Boolean!
    news: News
  }

  type News {
    _id: ID!
    headline: String!
    content: String!
    image: String
    """
    this value is either "school", "dept", "faculty" depending on who the news
    was created for
    """
    category: String!
    creator: User!
    """
    this value can be null if the value of the category field is not "school"
    """
    school: School
    """
    this value can be null if the value of the category field is not "faculty"
    """
    faculty: Faculty
    """
    this value can be null if the value of the category field is not "dept"
    """
    dept: Dept
  }
`;

import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		dept(id: ID!): Dept
		depts: [Dept]
	}

	extend type Mutation {
		createDept(input: deptInput): Dept
		updateDept(
			school: ID
			name: String
			faculty: ID
			description: String
			pay_per_semester: Int
		): Dept
	}

	input deptInput {
		school: ID!
		name: String!
		faculty: ID!
		description: String!
		pay_per_semester: Int
	}

	type Dept {
		_id: ID!
		school: School!
		faculty: Faculty!
		name: String!
		description: String!
		pay_per_semester: Int!
	}

	type DeptStatus {
		message: String!
		value: Boolean!
		dept: Dept!
	}

	extend type Subscription {
		deptCreated: Dept
	}
`;

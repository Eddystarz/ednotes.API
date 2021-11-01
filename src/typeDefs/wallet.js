import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		"""
		Fetch logged in students profile
		"""
		student: Student

		students: [Student]
	}

	extend type Mutation {
		createStudentProfile(input: studentProfileInput): StudentStatus

		updateStudentProfile(
			state: String
			school: ID
			faculty: ID
			dept: ID
			level: ID
			semester: Int
		): StudentStatus
	}

	input studentProfileInput {
		state: String
		school: ID
		faculty: ID
		dept: ID
		level: ID
		semester: Int
	}

	input editStudentInput {
		firstName: String
		lastName: String
		email: String
	}

	type WalletStatus {
		message: String!
		value: Boolean!
		wallet: Wallet
	}

	type Wallet {
		account_balance: Int!
		currency: String!
		updatedAt: Date!
	}
`;

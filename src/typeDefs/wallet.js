import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		"""
		Fetch logged in user wallet
		"""
		wallet: WalletStatus
	}

	extend type Mutation {
		fundWallet(amount: Int): WalletStatus
	}

	type WalletStatus {
		message: String!
		value: Boolean!
		wallet: Wallet
		authorization_url: String
	}

	type Wallet {
		account_balance: Float!
		currency: String!
		updatedAt: Date!
	}
`;

import { combineResolvers } from "graphql-resolvers";
import { ApolloError } from "apollo-server-express";

// ========== Models ==============//
import Wallet from "../database/Models/wallet";
import Transaction from "../database/Models/transaction";

// ============= Services ===============//
import { isAuthenticated } from "./middleware";
import paystack from "../services/paystack";

export default {
	Query: {
		wallet: combineResolvers(isAuthenticated, async (_, __, { Id }) => {
			try {
				const wallet = await Wallet.findOne({ user: Id });
				if (!wallet)
					return {
						message: "Wallet fetched unsuccessfully !",
						value: false,
					};
				// console.log("acb", wallet.get("account_balance"));
				// wallet.get('account_balance', null, { getters: false });

				return {
					message: "Wallet fetched successfully !",
					value: true,
					wallet,
				};
			} catch (error) {
				throw error;
			}
		}),
		get_wallet_transactions: combineResolvers(
			isAuthenticated,
			async (_, { cursor, limit }, { Id }) => {
				try {
					if (limit === undefined) {
						limit = 1;
					} else if (limit === 0) {
						throw new ApolloError("Specify a valid limit");
					}
					const wallet = await Wallet.findOne({ user: Id });
					if (!wallet)
						return {
							message: "No associated wallet !",
							value: false,
						};
					const where = {
						wallet,
						status: "success",
					};

					if (cursor) {
						where.date = { $lt: cursor };
					}

					const transactions = await Transaction.find(where)
						.limit(limit + 1)
						.sort({ date: -1 });
					if (transactions.length === 0) {
						return {
							edges: transactions,
						};
					} else if (transactions.length > 0) {
						const hasNextPage = transactions.length > limit;
						const edges = hasNextPage
							? transactions.slice(0, -1)
							: transactions;

						return {
							edges,
							pageInfo: {
								hasNextPage,
								endCursor: edges[edges.length - 1]?.date,
							},
						};
					}
					throw new ApolloError(
						"Something went wrong while trying to fetch transactions"
					);
				} catch (error) {
					throw error;
				}
			}
		),
	},

	Mutation: {
		fundWallet: combineResolvers(
			isAuthenticated,
			async (_, { amount }, { Id }) => {
				try {
					console.log("in fund");
					const wallet = await Wallet.findOne({ user: Id })
						.populate("user")
						.exec();
					if (!wallet)
						return {
							message: "No wallet is associated with this user",
							value: false,
						};

					const authorization_url = await paystack.initializeTransaction(
						wallet,
						amount
					);

					if (!authorization_url) {
						return {
							message: "Authorizing went wrong !",
							value: false,
						};
					}
					return {
						message: "Redirect to payment page",
						value: true,
						authorization_url,
					};
				} catch (error) {
					throw error;
				}
			}
		),
	},
};

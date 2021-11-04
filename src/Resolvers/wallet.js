import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Wallet from "../database/Models/wallet";

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
				// console.log("wallet", wallet);
				// console.log(
				// 	"wall ac",
				// 	parseFloat(wallet.account_balance),
				// 	parseFloat(wallet.account_balance)
				// );

				return {
					message: "Wallet fetched successfully !",
					value: true,
					wallet,
				};
			} catch (error) {
				throw error;
			}
		}),
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

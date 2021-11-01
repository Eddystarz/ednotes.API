import axios from "axios";
import Transaction from "../database/Models/transaction";
import config from "../helper/config";
const { PAYSTACK_API_SECRET } = config;
const initializeUrl = "https://api.paystack.co/transaction/initialize";
const axiosConfig = {
	headers: {
		Authorization: `Bearer ${PAYSTACK_API_SECRET}`,
		"Content-Type": "application/json",
	},
};

const initializeTransaction = async (wallet, amount) => {
	try {
		const transaction = await Transaction.create({
			user: wallet.user,
			wallet,
			amount,
			type: "credit",
			balance_after_transaction: wallet.account_balance,
			description: "Funding wallet attempt",
		});
		const initialized = await axios.post(
			initializeUrl,
			{
				email: wallet.user.email,
				amount: Number(amount) * 100,
				currency: wallet.currency,
				reference: transaction._id,
				channels: [["card", "bank", "ussd", "bank_transfer"]],
			},
			axiosConfig
		);
		return initialized?.data?.data?.authorization_url;
	} catch (error) {
		throw error;
	}
};

export default { initializeTransaction };

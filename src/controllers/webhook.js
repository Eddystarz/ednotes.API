import crypto from "crypto";
import Transaction from "../database/Models/transaction";
import Wallet from "../database/Models/wallet";
import config from "../helper/config";
const { PAYSTACK_API_SECRET } = config;

export const getPaystackEvent = async (req, res) => {
	try {
		const hash = crypto
			.createHmac("sha512", PAYSTACK_API_SECRET)
			.update(JSON.stringify(req.body))
			.digest("hex");

		if (hash === req.headers["x-paystack-signature"]) {
			const event = req.body;
			if (event.event === "charge.success") {
				const eventAmount = Number(event.data.amount) / 100;
				const transaction = await Transaction.findById(event.data.reference);
				const wallet = await Wallet.findById(transaction.wallet);
				const currentBalance = Number(wallet.get("account_balance"));
				const balance = currentBalance + eventAmount;
				wallet.set({ account_balance: balance });
				await wallet.save();

				transaction.status = "success";
				transaction.balance_after_transaction = balance.toFixed(2);
				transaction.date = event.data.paid_at;
				transaction.description = "Wallet funded";
				await transaction.save();
			} else {
				// handle future disputes
				console.log("not a charge.success");
			}
			// check for any case their is no transaction later and create
		}
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

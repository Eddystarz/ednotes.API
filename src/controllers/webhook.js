import crypto from "crypto";
import Transaction from "../database/Models/transaction";
import Wallet from "../database/Models/wallet";
import config from "../helper/config";
const { PAYSTACK_API_SECRET } = config;

export const getPaystackEvent = async (req, res) => {
	try {
		console.log("from web hook");

		const hash = crypto
			.createHmac("sha512", PAYSTACK_API_SECRET)
			.update(JSON.stringify(req.body))
			.digest("hex");

		if (hash === req.headers["x-paystack-signature"]) {
			// Retrieve the request's body

			const event = req.body;

			// Do something with event
			console.log("from paystack web hook", event);
			if (event.event === "charge.success") {
				const eventAmount = Number(event.data.amount) / 100;
				const transaction = await Transaction.findById(event.data.reference);
				const wallet = await Wallet.findByIdAndUpdate(
					transaction.wallet,
					{
						$inc: {
							account_balance: eventAmount,
						},
					},
					{ new: true }
				);
				transaction.status = "success";
				transaction.balance_after_transaction = wallet.account_balance;
				await transaction.save();
			} else {
				console.log("not a charge.success");
			}
			// check for any case their is no transaction later and create
		}
		res.send(200);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

import Transaction from "../database/Models/transaction";
class Transact {
	constructor(wallet) {
		this.wallet = wallet;
	}

	sufficientBalance(amount) {
		return this.wallet.account_balance > amount;
	}

	async debit(amount, description) {
		if (!this.sufficientBalance(amount)) return false;
		this.wallet.account_balance -= amount;
		await this.wallet.save();
		const { user, _id, account_balance } = this.wallet;
		const transaction = await Transaction.create({
			user,
			wallet: _id,
			type: "debit",
			status: "success",
			amount,
			balance_after_transaction: account_balance,
			description,
		});
		// can make a shallow copy later if seceret is unhidden when to Json
		return transaction;
	}

	// async credit(reference) {

	// }
}

export default Transact;

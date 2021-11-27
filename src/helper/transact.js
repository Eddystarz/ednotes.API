import Transaction from "../database/Models/transaction";
class Transact {
	constructor(wallet) {
		this.wallet = wallet;
	}

	currentWalletBalance() {
		return Number(this.wallet.get("account_balance"));
	}

	async setWalletBalance(amount) {
		this.wallet.set({ account_balance: amount });
		await this.wallet.save();
	}

	sufficientBalance(amount) {
		return this.currentWalletBalance() > amount;
	}

	async debit(amount, description) {
		if (!this.sufficientBalance(amount)) return false;
		const newBalance = this.currentWalletBalance() - amount;
		await this.setWalletBalance(newBalance);

		const { user, _id } = this.wallet;
		const transaction = await Transaction.create({
			user,
			wallet: _id,
			type: "debit",
			status: "success",
			amount,
			balance_after_transaction: newBalance.toFixed(2),
			description,
		});
		// can make a shallow copy later if seceret is unhidden when to Json
		return transaction;
	}

	// async credit(reference) {

	// }
}

export default Transact;

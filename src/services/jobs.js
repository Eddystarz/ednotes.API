import Story from "../database/Models/edstory";
import Student from "../database/Models/student";
import Transaction from "../database/Models/transaction";

// Delete Edstory
export const deleteStory = async (storyId) => {
	try {
		await Story.findByIdAndRemove(storyId);
	} catch (err) {
		throw err;
	}
};

export const deleteOtp = async (storyId) => {
	try {
		await Story.findByIdAndRemove(storyId);
	} catch (err) {
		throw err;
	}
};

export const endTrial = async (studentId) => {
	try {
		await Student.findByIdAndUpdate(studentId, {
			onTrial: false,
		});
	} catch (err) {
		throw err;
	}
};

export const deletePendingTransactions = async () => {
	const now = new Date();
	now.setDate(now.getDate() - 7);
	const sevenDaysAgo = now;
	try {
		await Transaction.deleteMany({
			status: "pending",
			createdAt: { $lte: sevenDaysAgo },
		});
	} catch (err) {
		throw err;
	}
};

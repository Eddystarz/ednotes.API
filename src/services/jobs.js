import Story from "../database/Models/edstory";
import Student from "../database/Models/student";

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

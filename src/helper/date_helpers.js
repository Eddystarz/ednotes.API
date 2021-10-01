import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Covert date to UTC
export const dateUtc = (date) => {
	const finalDate = date ? dayjs(date).utc().format() : dayjs().utc().format();

	return finalDate;
};

export const dateUtcMilliSec = () => {
	const date = new Date();
	const now_utc = Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	);
	return now_utc;
};
// might be useful later
// const now = dateUtcMilliSec() / 1000;
// const exipreDays = secondsToDays(Number(exp) - Number(iat));
// const daysFromIssued = secondsToDays(now - Number(iat));
// const daysLeftToExpire = `${exipreDays - daysFromIssued}d`;

export const secondsToDays = (seconds) => seconds / 60 / 60 / 24;

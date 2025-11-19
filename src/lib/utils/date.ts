function formatDateTimeStamp(timestamp: number) {
	const date = new Date(timestamp);
	return date.toLocaleString('en-CA').replace(',', '');
}

const date = {
	formatDateTimeStamp
};
export default date;

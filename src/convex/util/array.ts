function getUniqueListBy<T>(array: T[], key: keyof T) {
	return [...new Map(array.map((item) => [item[key], item])).values()];
}

function getUniqueList<T>(array: T[]) {
	return [...new Set(array)];
}

function batch<T>(array: T[], chunkSize: number) {
	const batches = [];

	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		batches.push(chunk);
	}

	return batches;
}

const array = {
	getUniqueListBy,
	getUniqueList,
	batch
};
export default array;

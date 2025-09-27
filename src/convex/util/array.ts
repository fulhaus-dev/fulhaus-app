function getUniqueListBy<T>(array: T[], key: keyof T) {
	return [...new Map(array.map((item) => [item[key], item])).values()];
}

function getUniqueList<T>(array: T[]) {
	return [...new Set(array)];
}

const array = {
	getUniqueListBy,
	getUniqueList
};
export default array;

function getUniqueListBy<T>(array: T[], key: keyof T) {
	return [...new Map(array.map((item) => [item[key], item])).values()];
}

const array = {
	getUniqueListBy
};
export default array;

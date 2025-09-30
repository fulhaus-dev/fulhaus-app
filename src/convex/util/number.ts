function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

const number = {
	isNumber
};
export default number;

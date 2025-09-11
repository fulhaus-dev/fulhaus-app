function now() {
	return +new Date().getTime().toPrecision(17);
}

const date = {
	now
};

export default date;

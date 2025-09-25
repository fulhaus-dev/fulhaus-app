function getDifference<T extends object>(obj1: T, obj2: Partial<T>): Partial<T> {
	return (Object.keys(obj2) as Array<keyof T>).reduce((acc, key) => {
		if (JSON.stringify(obj2[key]) !== JSON.stringify(obj1[key])) acc[key] = obj2[key];

		return acc;
	}, {} as Partial<T>);
}

const object = {
	getDifference
};
export default object;

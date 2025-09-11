export function otp() {
	const OTP_LENGTH = 6;
	const otp = Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join('');
	return otp;
}

const generator = {
	otp
};

export default generator;

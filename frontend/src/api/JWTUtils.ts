export const parseJWT = (token: string) => {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		return null;
	}
};

export const isTokenExpired = (token: string) => {
	const decodedJWT = parseJWT(token);
	const expired = decodedJWT.exp * 1000 < Date.now();

	if (expired) console.log("Token expired");
	return expired;
};

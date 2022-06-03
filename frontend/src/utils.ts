export const humanFileSize = (bytes: number, si = false, dp = 1) => {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + " B";
	}

	const units = si
		? ["ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"]
		: ["Kio", "Mio", "Gio", "Tio", "Pio", "Eio", "Zio", "Yio"];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(dp) + " " + units[u];
};

export const addressToStreetCodeCity = (address: string) => {
	const codeReg = /([0-9]{5})/g;
	const [street, code, city] = address.split(codeReg);

	return [street.trim(), code.trim(), city.trim()];
};

export const phone_number_parser = (phone: string) => {
	let reg = new RegExp(/((?:(?:\+|00)33|0))(\s*[1-9])((?:[\s.-]*\d{2}){4})/gm);
	let matches = reg.exec(phone);

	if (matches == null) {
		return { matched: false };
	}

	return {
		matched: true,
		full: matches[0],
		dialing_code: matches[1],
		first_digit: matches[2],
		end_number: matches[3]
	};
};

export const phone_number_prettify = (phone: string) => {
	const parsed = phone_number_parser(phone);

	// si ce n'est pas un numéro de téléphone, on retourne le texte tel quel
	if (!parsed.matched) return phone;

	let dialing_code = parsed.dialing_code!.length == 1 ? parsed.dialing_code : parsed.dialing_code + " ";
	let end_number_with_spaces = parsed.end_number!.replace(/(.{2})/g, "$1 ");
	return `${dialing_code}${parsed.first_digit} ${end_number_with_spaces}`;
};

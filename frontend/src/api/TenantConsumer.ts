import { API_URL } from "./ApiConfig";
import { Tenant } from "./models/tenant";

export const getTenantInfos = async (token: string, id: string): Promise<Tenant | undefined> => {
	const response = await fetch(API_URL + "/tenant/" + id, {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return undefined;
	}

	return await response.json();
};

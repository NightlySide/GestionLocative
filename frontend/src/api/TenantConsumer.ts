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

export const getTenants = async (token: string): Promise<Tenant[]> => {
	const response = await fetch(API_URL + "/tenant", {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return [];
	}
	const tenantsIds = (await response.json()) as string[];

	const tenants: Tenant[] = [];
	await Promise.all(
		tenantsIds.map(async (id: string) => {
			const t = await getTenantInfos(token, id);
			tenants.push(t);
		})
	);

	return tenants.filter((t) => t != undefined) as Tenant[];
};

export const updateTenant = async (token: string, tenant: Tenant): Promise<Response> => {
	const response = await fetch(API_URL + "/tenant/" + tenant.id, {
		method: "put",
		headers: { "Content-Type": "application/json", AccessToken: token },
		body: JSON.stringify(tenant)
	});

	return response;
};

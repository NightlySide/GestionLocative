import { API_URL } from "./ApiConfig";
import { Property } from "./models/property";

export const getProperties = async (token: string): Promise<Property[]> => {
	const response = await fetch(API_URL + "/property", {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return [];
	}

	const property_ids: string[] = await response.json();
	const properties: Property[] = [];
	await Promise.all(
		property_ids.map(async (id) => {
			const resp = await getPropertyInfos(token, id);
			if (resp != undefined) properties.push(resp);
		})
	);

	properties.sort((a, b) => {
		if (a.surface < b.surface) return 1;
		if (a.surface > b.surface) return -1;
		return 0;
	});

	return properties;
};

export const getPropertyInfos = async (token: string, id: string): Promise<Property | undefined> => {
	const response = await fetch(API_URL + "/property/" + id, {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return undefined;
	}

	return await response.json();
};

export interface PropertyCreationValues {
	address: string;
	lot_number: string;
	floor: string;
	image: string;
	type: string;
	surface: number;
}

export const createProperty = async (token: string, property: PropertyCreationValues): Promise<Response> => {
	const response = await fetch(API_URL + "/property", {
		method: "post",
		headers: { "Content-Type": "application/json", AccessToken: token },
		body: JSON.stringify(property)
	});

	return response;
};

export const updateProperty = async (token: string, property: Property): Promise<Response> => {
	const response = await fetch(API_URL + "/property/" + property.id, {
		method: "put",
		headers: { "Content-Type": "application/json", AccessToken: token },
		body: JSON.stringify(property)
	});

	return response;
};

export interface Property {
	id: string;
	landlord_id: string;
	address: string;
	floor: string;
	image: string;
	lot_number: string;
	surface: number;
	type: string;
	rooms: string[];
	tenants: string[];
}

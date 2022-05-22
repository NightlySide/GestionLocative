export interface Property {
	id: string;
	landlord_id: string;
	address: string;
	image: string;
	lot_number: number;
	surface: number;
	type: string;
	rooms: string[];
	tenants: string[];
}

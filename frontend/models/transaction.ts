export type Transaction = {
	id: string;
	amount: number;
	tenant_id: string;
	landlord_id: string;
	description: string;
	type: string;
	date: Date;
};

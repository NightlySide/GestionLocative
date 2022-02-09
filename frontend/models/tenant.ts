export type Tenant = {
	id: string;
	room_id: string;
	fullname: string;
	former_address: string;
	next_address?: string;
	comments?: string;
	entry_date: Date;
	leave_date?: Date;
	guarantor: string;
	email: string;
	tel: string;
	image?: string;
};

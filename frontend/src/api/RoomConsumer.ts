import { API_URL } from "./ApiConfig";
import { Room } from "./models/room";

export const getRooms = async (token: string, roomIds: string[]): Promise<Room[]> => {
	let rooms: Room[] = [];
	await Promise.all(
		roomIds.map(async (id) => {
			const resp = await getRoomInfos(token, id);
			if (resp != undefined) rooms.push(resp);
		})
	);
	rooms = rooms.filter((room) => room != undefined);

	rooms.sort((a, b) => {
		if (a.surface < b.surface) return 1;
		if (a.surface > b.surface) return -1;
		return 0;
	});

	return rooms;
};

export const getRoomInfos = async (token: string, id: string): Promise<Room | undefined> => {
	const response = await fetch(API_URL + "/room/" + id, {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return undefined;
	}

	return await response.json();
};

export const updateRoom = async (token: string, room: Room): Promise<Response> => {
	const response = await fetch(API_URL + "/room/" + room.id, {
		method: "put",
		headers: { "Content-Type": "application/json", AccessToken: token },
		body: JSON.stringify(room)
	});

	return response;
};

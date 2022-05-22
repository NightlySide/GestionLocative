import { API_URL } from "./ApiConfig";
import { Room } from "./models/room";

export const getRoomInfos = async (token: string, id: string): Promise<Room | undefined> => {
	const response = await fetch(API_URL + "/room/" + id, {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});
	if (response.status != 200) {
		return undefined;
	}

	return await response.json();
};

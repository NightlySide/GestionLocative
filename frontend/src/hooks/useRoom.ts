import { useState, useEffect } from "react";
import { useAuthContext } from "../components/AuthProvider";
import { Room } from "../api/models/room";
import { getRoomInfos } from "../api/RoomConsumer";

const useRoom = (id: string): [Room, (r: Room) => void] => {
	const { accessToken } = useAuthContext();
	const [room, setRoom] = useState<Room>();

	useEffect(() => {
		if (!id) return;
		(async () => setRoom(await getRoomInfos(accessToken, id)))();
	}, [id]);

	return [room, setRoom];
};

export default useRoom;

import { Room } from "../../api/models/room";
import PhotoGallery from "../../components/PhotoGallery";

const RoomInfos = ({ room }: { room: Room }) => {
	return <>Room infos : {room.id}</>;
};

export default RoomInfos;

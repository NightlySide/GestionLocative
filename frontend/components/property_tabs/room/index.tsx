import styles from "./room.module.css";

import PhotoChambre1 from "./chambre_1.jpg";
import PhotoChambre2 from "./chambre_2.jpg";
import PhotoChambre3 from "./chambre_3.jpg";
import Image from "next/image";
import { Card } from "@blueprintjs/core";

interface RoomPanelProps {
	room_id: number;
	property_id: number;
}

const RoomPanel = (props: RoomPanelProps) => {
	const renderPhoto = () => {
		const photos = [PhotoChambre1, PhotoChambre2, PhotoChambre3];

		return <Image alt={`Photo de la chambre n°${props.room_id}`} src={photos[props.room_id - 1]} />;
	};

	return (
		<div className={styles.container}>
			<Card>
				<h1>Chambre n°{props.room_id}</h1>
				<div className={styles.image_wrapper}>{renderPhoto()}</div>
			</Card>
		</div>
	);
};

export default RoomPanel;

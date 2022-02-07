import { Card } from "@blueprintjs/core";
import Image from "next/image";
import styles from "./informations.module.css";
import PhotoAppartement from "./appartement.jpg";

interface InformationsPanelProps {
	property_id: number;
}

const InformationsPanel = (props: InformationsPanelProps) => {
	return (
		<div className={styles.container}>
			<Card>
				<h1>Logement n°{props.property_id}</h1>
				<div className={styles.image_wrapper}>
					<Image src={PhotoAppartement} alt={`Photo du logement n°${props.property_id}`} />
				</div>
			</Card>
		</div>
	);
};

export default InformationsPanel;

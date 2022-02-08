import { Button, Card, Classes, Dialog, Elevation, Intent, Overlay } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import Image from "next/image";
import { useState } from "react";
import { Tenant } from "../../models/tenant";
import { phone_number_prettify } from "../../utils";
import TenantDialog from "../tenant_dialog";
import styles from "./tenant_card.module.css";

interface TenantCardProps {
	tenant: Tenant;
}

// TODO: Ajouter bouton "infos" et "chambre" si elle est attribuée, le bouton infos
// fait apparaitre un overlay : https://blueprintjs.com/docs/versions/4/#core/components/overlay
6;

const TenantCard = (props: TenantCardProps) => {
	const [isOverlayOpen, setOverlayOpen] = useState(false);
	const { tenant } = props;

	return (
		<Card className={styles.container}>
			<Tooltip2 className={styles.edit_button} content={`Editer la fiche de ${tenant.fullname}`}>
				<Button minimal icon="edit" />
			</Tooltip2>

			<h2 className={styles.title}>{tenant.fullname}</h2>

			<div className={styles.content}>
				<div className={styles.image_wrapper}>
					<Image alt={`Image de profil de ${tenant.fullname}`} src={tenant.image!} height={256} width={256} />
				</div>
				<div className={styles.infos}>
					<p>
						<b>Email</b>: {tenant.email}
					</p>
					<p>
						<b>Tel</b>: {phone_number_prettify(tenant.tel)}
					</p>
					<div className={styles.buttons}>
						<Button>Chambre</Button>
						<Button intent={Intent.PRIMARY} onClick={() => setOverlayOpen(true)}>
							Informations
						</Button>
						<TenantDialog tenant={tenant} isOpen={isOverlayOpen} setIsOpen={setOverlayOpen} />
					</div>
				</div>
			</div>
		</Card>
	);
};

export default TenantCard;

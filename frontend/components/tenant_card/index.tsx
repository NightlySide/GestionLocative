import { Button, Card } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import Image from "next/image";
import { Tenant } from "../../models/tenant";
import { phone_number_prettify } from "../../utils";
import styles from "./tenant_card.module.css";

interface TenantCardProps {
	tenant: Tenant;
}

const TenantCard = (props: TenantCardProps) => {
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
				</div>
			</div>
		</Card>
	);
};

export default TenantCard;

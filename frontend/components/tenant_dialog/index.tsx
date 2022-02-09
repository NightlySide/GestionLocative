import { Button, Card, Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { useTheme } from "next-themes";
import { Dispatch } from "react";
import { Tenant } from "../../models/tenant";
import { phone_number_prettify } from "../../utils";
import styles from "./tenant_dialog.module.css";

interface TenantDialogProps {
	tenant: Tenant;
	isOpen: boolean;
	setIsOpen: Dispatch<boolean>;
}

const TenantDialog = (props: TenantDialogProps) => {
	const { theme } = useTheme();
	const { tenant, isOpen, setIsOpen } = props;

	const renderRoomCard = () => {
		return (
			<p className={styles.no_data} style={{ textAlign: "center" }}>
				{"N'est pas affecté à une chambre pour le moment."}
			</p>
		);
	};

	const renderTransactionList = () => {
		return (
			<p className={styles.no_data} style={{ textAlign: "center" }}>
				Aucune transaction pour le moment
			</p>
		);
	};

	return (
		<Dialog
			className={`bp4-${theme} ${Classes.OVERLAY_SCROLL_CONTAINER}`}
			title={`Fiche de ${tenant.fullname}`}
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}>
			<div className={Classes.DIALOG_BODY}>
				<h2>Informations</h2>
				<p>
					<b>{"Nom d'affichage : "} </b> {tenant.fullname}
				</p>
				<br />
				<p>
					<b>{"Adresse email : "} </b> {tenant.email}
				</p>
				<p>
					<b>{"Numéro de téléphone : "} </b> {phone_number_prettify(tenant.tel)}
				</p>
				<p>
					<b>{"Garants : "} </b> {tenant.guarantor}
				</p>
				<br />
				<p>
					<b>{"Ancienne adresse : "} </b> {tenant.former_address}
				</p>
				<p>
					<b>{"Nouvelle adresse : "} </b>{" "}
					{tenant.next_address ?? <em className={styles.no_data}>{"N'a pas encore déménagé"}</em>}
				</p>
				<br />
				<p>
					<b>{"Date d'entrée : "} </b>{" "}
					{tenant.entry_date.toLocaleDateString("fr-FR", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric"
					})}
				</p>
				<p>
					<b>{"Date de départ : "} </b>{" "}
					{tenant.leave_date ?? <em className={styles.no_data}>{"N'a pas encore déménagé"}</em>}
				</p>
				<br />
				<p>
					<b>{"Commentaires : "} </b>{" "}
					{tenant.comments ?? <em className={styles.no_data}>{"Pas de commentaires"}</em>}
				</p>

				<hr className={styles.separator} />
				<h2>Logement occupé</h2>
				<Card>{renderRoomCard()}</Card>

				<hr className={styles.separator} />
				<h2>Dernières transactions</h2>

				<Card className={styles.transaction_list}>{renderTransactionList()}</Card>
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button icon="cross" onClick={() => setIsOpen(false)}>
						Close
					</Button>
				</div>
			</div>
		</Dialog>
	);
};

export default TenantDialog;

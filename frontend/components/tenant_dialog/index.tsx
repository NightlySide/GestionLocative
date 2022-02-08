import { Classes, Dialog } from "@blueprintjs/core";
import { useTheme } from "next-themes";
import { Dispatch } from "react";
import { Tenant } from "../../models/tenant";

interface TenantDialogProps {
	tenant: Tenant;
	isOpen: boolean;
	setIsOpen: Dispatch<boolean>;
}

const TenantDialog = (props: TenantDialogProps) => {
	const { theme } = useTheme();
	console.log(theme);

	return (
		<Dialog
			className={`bp4-${theme}`}
			title={`Fiche de ${props.tenant.fullname}`}
			isOpen={props.isOpen}
			onClose={() => props.setIsOpen(false)}>
			<div className={Classes.DIALOG_BODY}>
				<p>Détails du locataire ici</p>
			</div>
		</Dialog>
	);
};

export default TenantDialog;

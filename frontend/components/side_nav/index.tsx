import { Intent, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import styles from "./side_nav.module.css";

const SideNav = () => {
	return (
		<nav className={styles.sidenav}>
			<Menu large>
				<MenuDivider title="Gestion" />
				<MenuItem icon="pie-chart" text="Tableau de bord" />
				<MenuItem icon="people" text="Locataires" />
				<MenuItem icon="euro" text="Transactions" />
				<MenuDivider title="Logements" />
				<MenuItem icon="home" text="Bien n°1" />
				<MenuItem icon="home" text="Bien n°2" />
				<MenuItem icon="home" text="Bien n°3" />
				<MenuItem icon="plus" text="Ajouter un bien" intent={Intent.PRIMARY} />
			</Menu>
		</nav>
	);
};

export default SideNav;

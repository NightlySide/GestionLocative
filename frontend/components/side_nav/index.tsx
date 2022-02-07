import { Intent, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import Link from "next/link";
import styles from "./side_nav.module.css";

const SideNav = () => {
	return (
		<nav className={styles.sidenav}>
			<Menu large>
				<MenuDivider title="Gestion" />
				<Link href="/dashboard" passHref>
					<MenuItem icon="pie-chart" text="Tableau de bord" />
				</Link>
				<Link href="/tenant" passHref>
					<MenuItem icon="people" text="Locataires" />
				</Link>
				<MenuItem icon="euro" text="Transactions" />
				<MenuDivider title="Logements" />
				<Link href="/property/1" passHref>
					<MenuItem icon="home" text="Bien n°1" multiline />
				</Link>
				<Link href="/property/2" passHref>
					<MenuItem icon="home" text="Bien n°2" multiline />
				</Link>
				<Link href="/property/3" passHref>
					<MenuItem icon="home" text="Bien n°3" multiline />
				</Link>
				<MenuItem icon="plus" text="Ajouter un bien" intent={Intent.PRIMARY} />
			</Menu>
		</nav>
	);
};

export default SideNav;

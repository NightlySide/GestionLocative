import { Alignment, Button, Intent, Menu, MenuItem, Navbar, Position } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import styles from "./top_nav.module.css";

const TopNav = () => {
	return (
		<Navbar fixedToTop>
			<Navbar.Group align={Alignment.LEFT}>
				<Navbar.Heading>Gestion Locative</Navbar.Heading>
			</Navbar.Group>
			<Navbar.Group align={Alignment.RIGHT} className={styles.navbar_right_items}>
				<Popover2
					content={
						<Menu>
							<MenuItem icon="cog" text="Paramètres" />
							<MenuItem icon="log-out" text="Se déconnecter" intent={Intent.DANGER} />
						</Menu>
					}
					position={Position.BOTTOM}>
					<Button minimal icon="person" text="Jean Dupont" />
				</Popover2>
			</Navbar.Group>
		</Navbar>
	);
};

export default TopNav;

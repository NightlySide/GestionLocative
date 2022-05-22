import { Navbar } from "@mantine/core";
import { Dashboard, Home, User } from "tabler-icons-react";
import NavbarButton from "./NavbarButton";

const DashboardNavBar = () => {
	return (
		<Navbar width={{ base: 300 }} p="xs" style={{ minHeight: "calc(100vh - 60px)" }}>
			<Navbar.Section grow>
				<NavbarButton
					label="Tableau de bord"
					description="Vue d'ensemble"
					icon={<Dashboard />}
					linkTo="/management"
				/>
				<NavbarButton
					label="Logements"
					description="Liste des logements"
					icon={<Home />}
					linkTo="/management/property"
				/>
			</Navbar.Section>
			<Navbar.Section>
				<NavbarButton label="Mon compte" icon={<User />} barOnTop />
			</Navbar.Section>
		</Navbar>
	);
};

export default DashboardNavBar;
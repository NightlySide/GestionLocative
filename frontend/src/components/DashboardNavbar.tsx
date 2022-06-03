import { Navbar } from "@mantine/core";
import { Dashboard, FileEuro, Home, RoadSign, User, Users } from "tabler-icons-react";
import NavbarButton from "./NavbarButton";

const DashboardNavBar = () => {
	return (
		<Navbar width={{ base: 300 }} p="xs" style={{ minHeight: "calc(100vh - 60px)", zIndex: 0 }}>
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
				<NavbarButton
					label="Locataires"
					description="Liste des locataires"
					icon={<Users />}
					linkTo="/management/tenants"
				/>
				<NavbarButton
					label="Transactions"
					description="Liste des transactions"
					icon={<FileEuro />}
					linkTo="/management/transactions"
				/>
				<NavbarButton
					label="Upload test zone"
					description="Zone expérimentale, attention!"
					icon={<RoadSign />}
					linkTo="/management/upload"
				/>
			</Navbar.Section>
			<Navbar.Section>
				<NavbarButton label="Mon compte" icon={<User />} barOnTop />
			</Navbar.Section>
		</Navbar>
	);
};

export default DashboardNavBar;

import { Alignment, Navbar, Tab, TabId, Tabs } from "@blueprintjs/core";
import { useRouter } from "next/router";
import { useState } from "react";
import MainLayout from "../../components/main_layout";
import InformationsPanel from "../../components/property_tabs/informations";
import RoomPanel from "../../components/property_tabs/room";
import styles from "../../styles/Dashboard.module.css";

const PropertyPage = () => {
	const router = useRouter();
	const { pid } = router.query;

	const [activeTabId, setActiveTabId] = useState("info" as TabId);

	const renderPanel = () => {
		switch (activeTabId) {
			case "info":
				return <InformationsPanel property_id={parseInt(pid as string)} />;
			case "ch1":
				return <RoomPanel property_id={parseInt(pid as string)} room_id={1} />;
			case "ch2":
				return <RoomPanel property_id={parseInt(pid as string)} room_id={2} />;
			case "ch3":
				return <RoomPanel property_id={parseInt(pid as string)} room_id={3} />;
			default:
				return <div>Panel not found</div>;
		}
	};

	return (
		<MainLayout>
			<Navbar className={styles.tab_nav}>
				<Navbar.Group className={styles.tab_nav_group} align={Alignment.LEFT}>
					<Tabs
						className={styles.tabs}
						id="propertyTabs"
						onChange={(tabId: TabId) => setActiveTabId(tabId)}
						selectedTabId={activeTabId}
						animate
						large>
						<Tab id="info" className={styles.tab} title="Informations" />
						<Tab id="ch1" className={styles.tab} title="Chambre 1" />
						<Tab id="ch2" className={styles.tab} title="Chambre 2" />
						<Tab id="ch3" className={styles.tab} title="Chambre 3" />
						<Tabs.Expander />
						<Tab id="param" className={styles.tab} title="Paramètres" />
					</Tabs>
				</Navbar.Group>
			</Navbar>
			<div className={styles.panel}>{renderPanel()}</div>
		</MainLayout>
	);
};

export default PropertyPage;

import { Alignment, Navbar, Tab, TabId, Tabs } from "@blueprintjs/core";
import { useState } from "react";
import MainLayout from "../components/main_layout";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
	const [activeTabId, setActiveTabId] = useState("info" as TabId);

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
		</MainLayout>
	);
};

export default Dashboard;

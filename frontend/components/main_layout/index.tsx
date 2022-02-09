import SideNav from "../side_nav";
import TopNav from "../top_nav";
import styles from "./main_layout.module.css";

export interface MainLayoutProps {
	children: any;
}

const MainLayout = (props: MainLayoutProps) => {
	return (
		<div>
			<header>
				<TopNav />
			</header>

			<div className={styles.container}>
				<SideNav />
				<main className={styles.main}>{props.children}</main>
			</div>
		</div>
	);
};

export default MainLayout;

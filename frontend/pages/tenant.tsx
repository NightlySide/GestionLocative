import MainLayout from "../components/main_layout";
import styles from "../styles/Tenant.module.css";

const Tenant = () => {
	return (
		<MainLayout>
			<div className={styles.container}>Tenants</div>
		</MainLayout>
	);
};

export default Tenant;

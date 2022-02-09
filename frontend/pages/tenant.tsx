import MainLayout from "../components/main_layout";
import SiteHead from "../components/site_head";
import TenantCard from "../components/tenant_card";
import { Tenant } from "../models/tenant";
import styles from "../styles/Tenant.module.css";

const TenantPage = () => {
	// dummy data
	const tenant: Tenant = {
		id: "",
		room_id: "",
		fullname: "Pierre Deschesnes",
		former_address: "4 rue de la pierre ronde 28123 PAU",
		email: "p.deschesnes@gmail.com",
		entry_date: new Date(),
		guarantor: "Parents",
		tel: "0645786321",
		image: "http://ddg.wiki/wp-content/uploads/sites/22/2019/02/thispersondoesnotexist.com_000.jpg"
	};

	return (
		<MainLayout>
			<SiteHead title="Locataires" />
			<div className={styles.container}>
				<h1>Locataires</h1>
				<div className={styles.tenant_cards}>
					<TenantCard tenant={tenant} />
					<TenantCard tenant={tenant} />
					<TenantCard tenant={tenant} />
					<TenantCard tenant={tenant} />
					<TenantCard tenant={tenant} />
				</div>
			</div>
		</MainLayout>
	);
};

export default TenantPage;

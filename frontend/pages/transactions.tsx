import MainLayout from "../components/main_layout";
import SiteHead from "../components/site_head";
import TenantCard from "../components/tenant_card";
import TransactionCard from "../components/transaction_card";
import { Tenant } from "../models/tenant";
import { Transaction } from "../models/transaction";
import styles from "../styles/Transactions.module.css";

const TransactionsPage = () => {
	// dummy data
	const transaction_pos: Transaction = {
		id: "0",
		amount: 660.0,
		date: new Date(),
		description: "Loyer février 2022",
		landlord_id: "1",
		tenant_id: "2",
		type: "Liquide"
	};

	const transaction_neg: Transaction = {
		id: "0",
		amount: -45.0,
		date: new Date(),
		description: "Retour sur charges Janvier 2022",
		landlord_id: "1",
		tenant_id: "4",
		type: "Virement"
	};

	return (
		<MainLayout>
			<SiteHead title="Transactions" />
			<div className={styles.container}>
				<h1>Transactions</h1>
				<div className={styles.transactions_list}>
					{Array.from(Array(40).keys()).map((k: number) => {
						const index = Math.floor(Math.random() * 2);
						const trans = [transaction_neg, transaction_pos][index];
						return <TransactionCard key={k} transaction={trans} />;
					})}
				</div>
			</div>
		</MainLayout>
	);
};

export default TransactionsPage;

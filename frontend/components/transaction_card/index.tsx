import { Button, Card, Icon, Position } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Transaction } from "../../models/transaction";
import styles from "./transaction_card.module.css";

interface TransactionCardProps {
	transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
	const colorClassName = transaction.amount > 0 ? styles.positive : styles.negative;

	return (
		<Card className={styles.container}>
			<div className={`${styles.icon} ${colorClassName}`}>
				<Icon icon={transaction.amount > 0 ? "trending-up" : "trending-down"} />{" "}
			</div>
			<div className={`${styles.amount} ${colorClassName}`}>
				<h3 className={styles.title}>{transaction.amount} €</h3>
			</div>
			<div className={styles.infos}>
				<span className={styles.first_row}>
					<h3 className={styles.title}>{transaction.description}</h3>
					<span className={styles.date}>
						{transaction.date.toLocaleDateString("fr-FR", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric"
						})}
					</span>
				</span>
				<span>Pierre deschenes - {transaction.type}</span>
			</div>
			<Tooltip2 className={styles.edit_button} content="Editer la transaction" position={Position.LEFT}>
				<Button minimal icon="edit" />
			</Tooltip2>
		</Card>
	);
};

export default TransactionCard;

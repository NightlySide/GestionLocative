import { NextPage } from "next";
import { Button, Card, Elevation, FormGroup, InputGroup } from "@blueprintjs/core";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import { Tooltip2 } from "@blueprintjs/popover2";

const Login: NextPage = () => {
	const [showPassword, setShowPassword] = useState(false);

	const lockButton = (
		<Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`} position="left">
			<Button
				icon={showPassword ? "unlock" : "lock"}
				minimal={true}
				onClick={() => setShowPassword(!showPassword)}
			/>
		</Tooltip2>
	);

	return (
		<div className={`bp4-light ${styles.container}`}>
			<header></header>
			<main className={styles.main}>
				<Card className={styles.login_card} elevation={Elevation.TWO}>
					<h1>Espace utilisateur</h1>

					<FormGroup label="Nom d'utilisateur" labelFor="username">
						<InputGroup id="username" placeholder="jdupont" />
					</FormGroup>

					<FormGroup label="Mot de passe" labelFor="password">
						<InputGroup
							placeholder="**********"
							rightElement={lockButton}
							type={showPassword ? "text" : "password"}
						/>
					</FormGroup>

					<Button intent="primary" className={styles.login_btn}>
						Se connecter
					</Button>
				</Card>
			</main>
		</div>
	);
};

export default Login;

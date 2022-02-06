import { NextPage } from "next";
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import { Tooltip2 } from "@blueprintjs/popover2";
import Head from "next/head";
import { SITE_NAME } from "../constants";

const Login: NextPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({
		username: "",
		password: ""
	});

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const validate = () => {
		let tmp_errors = {
			username: "",
			password: ""
		};
		let isValid = true;

		if (username == "") {
			tmp_errors["username"] = "Le nom d'utilisateur n'est pas renseigné";
			isValid = false;
		}
		if (password == "") {
			tmp_errors["password"] = "Le mot de passe n'est pas renseigné";
			isValid = false;
		}

		setErrors(tmp_errors);
		return isValid;
	};

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
			<Head>
				<title>Connexion | {SITE_NAME}</title>
				<meta name="description" content="Page de connexion à l'espace utilisateur" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Card className={styles.login_card} elevation={Elevation.TWO}>
					<h1>Espace utilisateur</h1>

					<FormGroup
						label="Nom d'utilisateur"
						labelFor="username"
						helperText={errors["username"]}
						intent={errors["password"] == "" ? Intent.NONE : Intent.DANGER}>
						<InputGroup
							id="username"
							placeholder="jdupont"
							onChange={(e) => setUsername(e.target.value)}
							intent={errors["username"] == "" ? Intent.NONE : Intent.DANGER}
						/>
					</FormGroup>

					<FormGroup
						label="Mot de passe"
						labelFor="password"
						helperText={errors["password"]}
						intent={errors["password"] == "" ? Intent.NONE : Intent.DANGER}>
						<InputGroup
							placeholder="**********"
							rightElement={lockButton}
							type={showPassword ? "text" : "password"}
							onChange={(e) => setPassword(e.target.value)}
							intent={errors["password"] == "" ? Intent.NONE : Intent.DANGER}
						/>
					</FormGroup>

					<Button intent="primary" className={styles.login_btn} onClick={validate}>
						Se connecter
					</Button>
				</Card>
			</main>
		</div>
	);
};

export default Login;

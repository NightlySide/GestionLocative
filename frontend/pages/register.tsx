import { NextPage } from "next";
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import { Tooltip2 } from "@blueprintjs/popover2";
import Head from "next/head";
import { SITE_NAME } from "../constants";

const Login: NextPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConf, setShowPasswordConf] = useState(false);
	const [errors, setErrors] = useState({
		username: "",
		fullname: "",
		email: "",
		email_conf: "",
		password: "",
		password_conf: ""
	});

	/* form vars */
	const [username, setUsername] = useState("");
	const [fullname, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [emailConf, setEmailConf] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConf, setPasswordConf] = useState("");
	/* form vars */

	const lockButton = (
		<Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`} position="left">
			<Button
				icon={showPassword ? "unlock" : "lock"}
				minimal={true}
				onClick={() => setShowPassword(!showPassword)}
			/>
		</Tooltip2>
	);
	const lockButtonConf = (
		<Tooltip2 content={`${showPasswordConf ? "Hide" : "Show"} Password`} position="left">
			<Button
				icon={showPasswordConf ? "unlock" : "lock"}
				minimal={true}
				onClick={() => setShowPasswordConf(!showPasswordConf)}
			/>
		</Tooltip2>
	);

	const validateForm = () => {
		var isValid = true;
		var tmp_errors = {
			username: "",
			fullname: "",
			email: "",
			email_conf: "",
			password: "",
			password_conf: ""
		};

		// On vérifie que les champs ne sont pas vides
		if (username == "") {
			tmp_errors["username"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}
		if (fullname == "") {
			tmp_errors["fullname"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}
		if (email == "") {
			tmp_errors["email"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}
		if (emailConf == "") {
			tmp_errors["email_conf"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}
		if (password == "") {
			tmp_errors["password"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}
		if (passwordConf == "") {
			tmp_errors["password_conf"] = "Ce champ ne peut pas être vide";
			isValid = false;
		}

		if (username.length < 6) {
			tmp_errors["username"] = "Le pseudonyme doit faire au moins 6 caractères";
			isValid = false;
		}
		if (password.length < 6) {
			tmp_errors["password"] = "Le mot de passe doit faire au moins 8 caractères";
			isValid = false;
		}
		if (!validateEmail(email)) {
			tmp_errors["email"] = "L'adresse email doit être valide";
			isValid = false;
		}
		if (email != emailConf) {
			tmp_errors["email_conf"] = "Les deux adresses doivent être identiques";
			isValid = false;
		}
		if (password != passwordConf) {
			tmp_errors["password_conf"] = "Les deux mots de passe doivent être identiques";
			isValid = false;
		}

		setErrors(tmp_errors);
		return isValid;
	};

	return (
		<div className={`bp4-light ${styles.container}`}>
			<Head>
				<title>Inscription | {SITE_NAME}</title>
				<meta name="description" content="Page de connexion à l'espace utilisateur" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Card className={styles.login_card} elevation={Elevation.TWO}>
					<h1>Inscription</h1>

					<FormGroup
						label="Pseudonyme"
						labelFor="username"
						intent={errors["username"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["username"]}>
						<InputGroup
							id="username"
							placeholder="jdupont"
							intent={errors["username"] != "" ? Intent.DANGER : Intent.NONE}
							onChange={(event) => setUsername(event.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label="Nom d'affichage"
						labelFor="fullname"
						intent={errors["fullname"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["fullname"]}>
						<InputGroup
							id="fullname"
							placeholder="Jean Dupont"
							intent={errors["fullname"] != "" ? Intent.DANGER : Intent.NONE}
							onChange={(event) => setFullName(event.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label="Adresse e-mail"
						labelFor="email"
						intent={errors["email"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["email"]}>
						<InputGroup
							id="email"
							placeholder="j.dupont@gmail.com"
							intent={errors["email"] != "" ? Intent.DANGER : Intent.NONE}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label="Confirmation de l'adresse email"
						labelFor="conf-email"
						intent={errors["email_conf"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["email_conf"]}>
						<InputGroup
							id="conf-email"
							placeholder="j.dupont@gmail.com"
							intent={errors["email_conf"] != "" ? Intent.DANGER : Intent.NONE}
							onChange={(event) => setEmailConf(event.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label="Mot de passe"
						labelFor="password"
						intent={errors["password"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["password"]}>
						<InputGroup
							id="password"
							placeholder="**********"
							rightElement={lockButton}
							type={showPassword ? "text" : "password"}
							onChange={(event) => setPassword(event.target.value)}
							intent={errors["password"] != "" ? Intent.DANGER : Intent.NONE}
						/>
					</FormGroup>

					<FormGroup
						label="Confirmation du mot de passe"
						labelFor="conf-password"
						intent={errors["password_conf"] != "" ? Intent.DANGER : Intent.NONE}
						helperText={errors["password_conf"]}>
						<InputGroup
							id="conf-password"
							placeholder="**********"
							rightElement={lockButtonConf}
							type={showPasswordConf ? "text" : "password"}
							onChange={(event) => setPasswordConf(event.target.value)}
							intent={errors["password_conf"] != "" ? Intent.DANGER : Intent.NONE}
						/>
					</FormGroup>

					<Button intent="primary" className={styles.login_btn} onClick={validateForm}>
						{"S'enregistrer"}
					</Button>
				</Card>
			</main>
		</div>
	);
};

const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

export default Login;

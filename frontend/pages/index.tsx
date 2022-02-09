import { Alignment, Button, Intent, Navbar } from "@blueprintjs/core";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Hero from "../components/hero";
import { SITE_NAME } from "../constants";
import styles from "../styles/Landing.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>{SITE_NAME}</title>
				<meta name="description" content="Application de gestion locative" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header>
				<Navbar>
					<Navbar.Group align={Alignment.LEFT}>
						<Navbar.Heading>{SITE_NAME}</Navbar.Heading>
					</Navbar.Group>
					<Navbar.Group align={Alignment.RIGHT} className={styles.nav_right_items}>
						<Button minimal text="Accueil" />
						<Button minimal text="Fonctionnalités" />
						<Button minimal text="A propos" />
						<Navbar.Divider />
						<Link href="/login" passHref>
							<Button intent={Intent.SUCCESS} icon="home" text="Espace Gestion" />
						</Link>
					</Navbar.Group>
				</Navbar>
			</header>

			<main className={styles.main}>
				<Hero />
			</main>

			<footer className={styles.footer}>
				Conçut et développé par{" "}
				<span>
					<a href="https://nightlyside.github.io/">Alexandre F.</a>
				</span>
				{" &"} Noctis
			</footer>
		</div>
	);
};

export default Home;

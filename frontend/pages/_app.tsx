import "../styles/globals.css";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import styles from "../styles/App.module.css";

import type { AppProps } from "next/app";
import { DarkThemeToggle, ThemeContext } from "../components/dark_theme_toggle";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
	const [theme, setTheme] = useState("light");
	const rootClassName = theme === "light" ? styles.root_light : styles.root_dark;

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div className={`${rootClassName} bp4-${theme}`}>
				<Component {...pageProps} />
				<DarkThemeToggle />
			</div>
		</ThemeContext.Provider>
	);
}

export default MyApp;

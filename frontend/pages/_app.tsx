import "../styles/globals.css";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import styles from "../styles/App.module.css";

import type { AppProps } from "next/app";
import { DarkThemeToggle } from "../components/dark_theme_toggle";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<ThemeProvider>
			<AppWrapper Component={Component} pageProps={pageProps} router={router} />
		</ThemeProvider>
	);
}

function AppWrapper({ Component, pageProps }: AppProps) {
	const { theme } = useTheme();
	const rootClassName = theme === "light" ? styles.root_light : styles.root_dark;

	// to avoid hybridation mismatch (https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch)
	const [mounted, setMounted] = useState(false);
	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<div className={`${rootClassName} bp4-${theme}`}>
			<Component {...pageProps} />
			<DarkThemeToggle />
		</div>
	);
}

export default MyApp;

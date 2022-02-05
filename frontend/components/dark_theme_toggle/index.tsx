import { Button, Icon } from "@blueprintjs/core";
import { createContext, useContext } from "react";

import styles from "./style.module.css";

export const ThemeContext = createContext({
	theme: "light",
	setTheme: (_value: string) => {}
});

export const DarkThemeToggle = () => {
	const context = useContext(ThemeContext);

	return (
		<Button
			className={styles.toggle}
			minimal
			onClick={() => context.setTheme(context.theme === "light" ? "dark" : "light")}>
			<Icon icon={context.theme === "light" ? "moon" : "lightbulb"} />
		</Button>
	);
};

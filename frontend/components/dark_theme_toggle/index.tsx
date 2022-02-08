import { Button, Icon, Position } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { createContext, useContext } from "react";

import styles from "./style.module.css";

export const ThemeContext = createContext({
	theme: "light",
	setTheme: (_value: string) => {}
});

export const DarkThemeToggle = () => {
	const context = useContext(ThemeContext);
	const next_theme = context.theme === "light" ? "sombre" : "clair";

	return (
		<Tooltip2
			className={styles.toggle}
			content={`Basculer sur le thème ${next_theme}`}
			position={Position.BOTTOM_LEFT}>
			<Button minimal onClick={() => context.setTheme(context.theme === "light" ? "dark" : "light")}>
				<Icon icon={context.theme === "light" ? "moon" : "lightbulb"} />
			</Button>
		</Tooltip2>
	);
};

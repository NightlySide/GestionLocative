import { Button, Icon, Position } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useTheme } from "next-themes";

import styles from "./dark_theme_toggle.module.css";

export const DarkThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const next_theme = theme === "light" ? "sombre" : "clair";

	return (
		<Tooltip2
			className={styles.toggle}
			content={`Basculer sur le thème ${next_theme}`}
			position={Position.BOTTOM_LEFT}>
			<Button minimal onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
				<Icon icon={theme === "light" ? "moon" : "lightbulb"} />
			</Button>
		</Tooltip2>
	);
};

import { MantineProvider, ColorSchemeProvider, ColorScheme, TypographyStylesProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";

const AppWrapper = (props: any) => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
				<AuthProvider>
					<ModalsProvider>
						<NotificationsProvider>
							<BrowserRouter>{props.children}</BrowserRouter>
						</NotificationsProvider>
					</ModalsProvider>
				</AuthProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
};

export default AppWrapper;

import { Text, Group, Button, ActionIcon, useMantineTheme, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars, Search } from "tabler-icons-react";

const Searchbar = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();

	return (
		<Group>
			<Button
				radius="md"
				variant="default"
				leftIcon={
					<Search size={16} color={colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.dark[6]} />
				}>
				<Text
					mt="0.2em"
					ml="0.2em"
					color="dimmed"
					weight={400}
					style={{ textAlign: "left", minWidth: "200px" }}>
					Rechercher
				</Text>
			</Button>
			{/*
			<ActionIcon radius="md" variant="default" onClick={() => toggleColorScheme()} size={36}>
				{colorScheme === "dark" ? <Sun size={20} /> : <MoonStars size={20} />}
			</ActionIcon> */}
		</Group>
	);
};

export default Searchbar;

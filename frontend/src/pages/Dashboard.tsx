import { AppShell, Group, Header, Title, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavBar from "../components/DashboardNavbar";
import Searchbar from "../components/Searchbar";

const DashboardHeader = () => {
	const { colorScheme } = useMantineColorScheme();
	const navigate = useNavigate();

	return (
		<Header height={60}>
			<Group sx={{ height: "100%" }} px={20} position="apart">
				<UnstyledButton onClick={() => navigate("/")} p="sm" pl={0}>
					<Title
						order={4}
						style={{
							color: colorScheme === "dark" ? "#fff" : "#000"
						}}>
						Gestion locative
					</Title>
				</UnstyledButton>
				<Searchbar />
			</Group>
		</Header>
	);
};

const Dashboard = () => {
	return (
		<div className="container">
			<AppShell
				padding="md"
				header={<DashboardHeader />}
				navbar={<DashboardNavBar />}
				styles={(theme) => ({
					main: {
						backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
						height: "calc(100vh - 60px)",
						overflowY: "auto"
					}
				})}>
				<main>
					<Outlet />
				</main>
			</AppShell>
		</div>
	);
};

export default Dashboard;

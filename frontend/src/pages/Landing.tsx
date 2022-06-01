import { ActionIcon, AppShell, Button, Group, Header, Title, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoonStars, Sun } from "tabler-icons-react";
import { useAuthContext } from "../components/AuthProvider";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import useLogout from "../hooks/useLogout";

const LandingHeader = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const navigate = useNavigate();
	const location = useLocation();
	const [modalOpened, setModalOpened] = useState("none");

	const { accessToken } = useAuthContext();
	const logout = useLogout(true);

	const ShowButtons = () => {
		if (accessToken != "") {
			return (
				<>
					<Button onClick={() => navigate("/management", { state: location })}>Espace Gestion</Button>
					<Button color="red" variant="outline" onClick={logout}>
						Déconnexion
					</Button>
				</>
			);
		}

		return (
			<>
				<Button onClick={() => setModalOpened("register")}>Inscription</Button>
				<Button variant="default" onClick={() => setModalOpened("login")}>
					Connexion
				</Button>
			</>
		);
	};

	return (
		<>
			<RegisterModal
				opened={modalOpened === "register"}
				onClose={() => setModalOpened("none")}
				onSwitch={() => setModalOpened("login")}
			/>
			<LoginModal
				opened={modalOpened === "login"}
				onClose={() => setModalOpened("none")}
				onSwitch={() => setModalOpened("register")}
			/>
			<Header height={60}>
				<Group sx={{ height: "100%" }} px={20} position="apart">
					<Title
						order={4}
						style={{
							color: colorScheme === "dark" ? "#fff" : "#000"
						}}>
						Gestion locative
					</Title>
					<Group>
						<ShowButtons />
						{/*<ActionIcon variant="default" onClick={() => toggleColorScheme()} size={36}>
							{colorScheme === "dark" ? <Sun size={20} /> : <MoonStars size={20} />}
					</ActionIcon> */}
					</Group>
				</Group>
			</Header>
		</>
	);
};

const Landing = () => {
	return (
		<div className="container">
			<AppShell padding="md" header={<LandingHeader />}>
				Content
			</AppShell>
		</div>
	);
};

export default Landing;

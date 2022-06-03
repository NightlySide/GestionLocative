import { Button, Group, Modal, PasswordInput, TextInput, Anchor, useMantineColorScheme, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { useState } from "react";
import { User, Lock } from "tabler-icons-react";
import { getUserInfos, loginUser } from "../../api/AuthConsumer";
import { useAuthContext } from "../AuthProvider";

interface LoginModalProps {
	onClose: () => void;
	onSwitch: () => void;
	opened: boolean;
}

const LoginModal = (props: LoginModalProps) => {
	const { colorScheme } = useMantineColorScheme();
	const [loading, setLoading] = useState(false);
	const { setAccessToken } = useAuthContext(false);

	const form = useForm({
		initialValues: {
			username: "",
			password: "",
			rememberme: false
		},

		validate: {}
	});

	const sendLoginUser = async (values: any) => {
		form.clearErrors();
		setLoading(true);
		const response = await loginUser(values);

		// success
		if (response.status == 200) {
			const data = await response.json();
			setAccessToken(data["access-token"]);

			// hide error notifications
			cleanNotifications();

			const userData = await (await getUserInfos(data["access-token"])).json();
			showNotification({
				color: "teal",
				autoClose: 10000,
				title: "Bon retour parmis nous!",
				message: `Bienvenue ${userData["fullname"]} dans votre espace de gestion locative`
			});

			props.onClose();
			form.reset();
		}
		// bad creds
		else if (response.status == 400) {
			const reason = (await response.json())["message"].toLowerCase();

			if (reason.includes("exist")) {
				form.setFieldError("username", "Le nom d'utilisateur n'existe pas.");
			} else {
				form.setFieldError("password", "Mauvaise combinaison nom d'utilisateur / mot de passe.");
			}
		}

		setLoading(false);
	};

	return (
		<Modal
			opened={props.opened}
			onClose={props.onClose}
			title="Connexion à l'espace gestion"
			centered
			transition="slide-down">
			<form onSubmit={form.onSubmit(sendLoginUser)}>
				<TextInput
					data-autofocus
					disabled={loading}
					required
					label="Nom d'utilisateur"
					placeholder="jdupont"
					icon={<User size={18} />}
					{...form.getInputProps("username")}
					mt="md"
				/>
				<PasswordInput
					disabled={loading}
					required
					label="Mot de passe"
					icon={<Lock size={18} />}
					placeholder="**********"
					{...form.getInputProps("password")}
					mt="md"
				/>

				<Group mt="lg" position="left">
					<Checkbox
						disabled={loading}
						label="Se souvenir de moi"
						{...form.getInputProps("rememberme", { type: "checkbox" })}
					/>
				</Group>

				<Group position="apart" mt="lg">
					<Anchor
						style={{ fontSize: "0.85em", color: colorScheme === "dark" ? "#C1C2C5" : "#212529" }}
						onClick={props.onSwitch}>
						Créer un compte
					</Anchor>
					<Button loading={loading} type="submit">
						Connexion
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export default LoginModal;

import { Button, Group, Modal, PasswordInput, TextInput, Anchor, useMantineColorScheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Mail, Lock, Check } from "tabler-icons-react";
import { registerUser } from "../api/AuthConsumer";

interface RegisterModalProps {
	onClose: () => void;
	onSwitch: () => void;
	opened: boolean;
}

const RegisterModal = (props: RegisterModalProps) => {
	const { colorScheme } = useMantineColorScheme();
	const [loading, setLoading] = useState(false);

	const form = useForm({
		initialValues: {
			email: "",
			prenom: "",
			nom: "",
			username: "",
			password: "",
			confirm_password: ""
		},

		validate: {
			email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Email invalide")
		}
	});

	const sendRegisterUser = async (values: any) => {
		form.clearErrors();
		setLoading(true);
		const response = await registerUser(values);

		// success
		if (response.status == 201) {
			showNotification({
				color: "teal",
				autoClose: 5000,
				title: "Compte créé avec succès!",
				message: "Vous pouvez dès à présent vous connecter avec vos identifiants"
			});
			props.onClose();
			form.reset();
		}
		// wrong data sent
		else if (response.status == 400) {
			const reason = (await response.json())["message"].toLowerCase();
			if (reason.includes("user")) {
				form.setFieldError("username", "Ce nom d'utilisateur est déjà pris.");
			} else if (reason.includes("email")) {
				form.setFieldError("email", "Cette adresse email est déjà utilisée");
			}
		}
		// other error
		else {
			showNotification({
				color: "red",
				autoClose: 15000,
				title: "Erreur serveur!",
				message: "Quelque chose s'est mal déroulé. Veuillez rééssayer ultérieurement"
			});
		}

		setLoading(false);
	};

	return (
		<Modal opened={props.opened} onClose={props.onClose} title="Créer un compte" centered transition="slide-down">
			<form onSubmit={form.onSubmit(sendRegisterUser)}>
				<Group spacing="xs">
					<TextInput
						disabled={loading}
						data-autofocus
						style={{ maxWidth: "calc(50% - 5px)" }}
						required
						label="Prénom"
						placeholder="Jean"
						{...form.getInputProps("prenom")}
					/>
					<TextInput
						disabled={loading}
						style={{ maxWidth: "calc(50% - 6px)" }}
						required
						label="Nom"
						placeholder="Dupont"
						{...form.getInputProps("nom")}
					/>
				</Group>

				<TextInput
					disabled={loading}
					required
					label="Nom d'utilisateur"
					placeholder="jdupont"
					{...form.getInputProps("username")}
					mt="md"
				/>

				<TextInput
					disabled={loading}
					required
					label="Email"
					icon={<Mail size={18} />}
					placeholder="jdupont@gmail.com"
					{...form.getInputProps("email")}
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
				<PasswordInput
					disabled={loading}
					required
					label="Confirmation"
					icon={<Lock size={18} />}
					placeholder="**********"
					{...form.getInputProps("confirm_password")}
					mt="md"
				/>

				<Group position="apart" mt="lg">
					<Anchor
						style={{ fontSize: "0.85em", color: colorScheme === "dark" ? "#C1C2C5" : "#212529" }}
						onClick={props.onSwitch}>
						J'ai déjà un compte
					</Anchor>
					<Button type="submit" loading={loading}>
						Inscription
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export default RegisterModal;

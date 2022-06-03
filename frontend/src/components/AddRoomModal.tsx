import { Text, Button, Group, Modal, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Numbers, Stairs, Building } from "tabler-icons-react";
import { useAuthContext } from "./AuthProvider";
import { createProperty, PropertyCreationValues } from "../api/PropertyConsumer";

interface AddRoomModalProps {
	onCreate: () => void;
	onClose: () => void;
	opened: boolean;
}

const AddRoomModal = (props: AddRoomModalProps) => {
	const { accessToken } = useAuthContext();
	const [loading, setLoading] = useState(false);

	const form = useForm({
		initialValues: {
			street: "",
			postalCode: "",
			city: "",
			floor: "",
			surface: "",
			lot_number: "",
			type: ""
		},

		validate: {}
	});

	const sendCreateProperty = async (values: any) => {
		form.clearErrors();
		setLoading(true);

		let property: PropertyCreationValues = {
			address: `${values.street} ${values.postalCode} ${values.city}`,
			...values
		};
		const response = await createProperty(accessToken, property);

		// success
		if (response.status == 201) {
			showNotification({
				color: "teal",
				autoClose: 5000,
				title: "Opération réussie !",
				message: "Vous avez créé un nouveau logement. Il est disponible dans la barre de navigation à gauche."
			});
			props.onCreate();
			props.onClose();
			form.reset();
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
		<Modal
			opened={props.opened}
			onClose={props.onClose}
			title="Créer un logement"
			centered
			transition="slide-down"
			closeOnClickOutside={false}>
			<form onSubmit={form.onSubmit(sendCreateProperty)}>
				<TextInput
					data-autofocus
					disabled={loading}
					required
					icon={<Numbers size={18} />}
					label="Adresse"
					description="Numéro et rue"
					placeholder="3 rue des jardins"
					{...form.getInputProps("street")}
					mt="md"
				/>

				<Group spacing="xs" mt="md">
					<TextInput
						disabled={loading}
						style={{ maxWidth: "calc(50% - 5px)" }}
						required
						label="Code postal"
						placeholder="35200"
						{...form.getInputProps("postalCode")}
					/>
					<TextInput
						disabled={loading}
						style={{ maxWidth: "calc(50% - 6px)" }}
						required
						label="Ville"
						placeholder="Rennes"
						{...form.getInputProps("city")}
					/>
				</Group>

				<Group spacing="xs" mt="md">
					<NumberInput
						disabled={loading}
						required
						precision={2}
						step={0.1}
						label="Surface"
						placeholder="50"
						style={{ maxWidth: "calc(50% - 5px)" }}
						rightSection={
							<Text color="dimmed" weight={400} size="sm">
								m²
							</Text>
						}
						{...form.getInputProps("surface")}
					/>
					<TextInput
						disabled={loading}
						label="Numéro de lot"
						placeholder="1"
						style={{ maxWidth: "calc(50% - 6px)" }}
						{...form.getInputProps("lot_number")}
					/>
				</Group>

				<TextInput
					disabled={loading}
					required
					icon={<Stairs size={18} />}
					label="Étage"
					description="Numéro ou RDC"
					placeholder="RDC"
					{...form.getInputProps("floor")}
					mt="md"
				/>

				<Select
					disabled={loading}
					required
					label="Type de logement"
					description="Logement entier ou colocation"
					placeholder="Veuillez choisir"
					icon={<Building size={18} />}
					{...form.getInputProps("type")}
					mt="md"
					data={[
						{ value: "full", label: "Logement entier" },
						{ value: "sharing", label: "Colocation" }
					]}
					onChange={(value) => form.setFieldValue("type", value!)}
				/>

				<Group position="right" mt="lg">
					<Button type="submit" loading={loading}>
						Créer le logement
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export default AddRoomModal;

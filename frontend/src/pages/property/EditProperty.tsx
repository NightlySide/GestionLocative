import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Center, Group, Image, Loader, NumberInput, Select, TextInput, Title } from "@mantine/core";
import useProperty from "../../hooks/useProperty";
import { useForm } from "@mantine/form";
import { Text } from "@mantine/core";
import { Building, DeviceFloppy, Photo, Stairs, X } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { addressToStreetCodeCity } from "../../utils";
import { getImagesList, getObjectImage } from "../../api/ImagesConsumer";
import { useAuthContext } from "../../components/AuthProvider";
import { Property } from "../../api/models/property";
import { showNotification } from "@mantine/notifications";
import { updateProperty } from "../../api/PropertyConsumer";

const PreviewImage = ({ token, property, imgName }: { token: string; property: Property; imgName: string }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		(async () => {
			const imgBlob = await getObjectImage(token, "property", property.id, imgName);
			setUrl(URL.createObjectURL(imgBlob));
		})();
	}, [imgName]);

	return (
		<Center mt="md" style={{ marginLeft: "auto", marginRight: "auto" }}>
			<Image src={url} height={300} width="auto" />
		</Center>
	);
};

const EditPropertyPage = () => {
	let { id } = useParams();
	const { accessToken } = useAuthContext();
	const [property] = useProperty(id);
	const [imagesList, setImagesList] = useState([] as string[]);
	const [fetchedImageList, setFetchedImageList] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			street: "",
			postalCode: "",
			city: "",
			lotNumber: "",
			floor: "",
			image: "",
			type: "",
			surface: 0.0
		},

		validate: {}
	});

	useEffect(() => {
		if (!property) return;
		if (form.values["type"] != "") return;

		const [street, code, city] = addressToStreetCodeCity(property.address);
		const imageUrl = imagesList.length > 0 ? property.image : "";

		form.setValues({
			street: street,
			postalCode: code,
			city: city,
			lotNumber: property.lot_number,
			floor: property.floor,
			image: imageUrl,
			type: property.type,
			surface: property.surface
		});

		// fetch images
		(async () => {
			const names = await getImagesList(accessToken, "property", property.id);
			setImagesList(names);
			setFetchedImageList(true);
		})();
	}, [property]);

	// show loader if data is not ready
	if (property == undefined || fetchedImageList == false) {
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);
	}

	const sendUpdateProperty = async (values: any) => {
		form.clearErrors();
		setLoading(true);

		let propertyToSend: Property = {
			...property,
			address: `${values.street} ${values.postalCode} ${values.city}`,
			floor: values["floor"],
			image: values["image"],
			lot_number: values["lotNumber"],
			type: values["type"],
			surface: values["surface"]
		};
		console.log(propertyToSend);
		const response = await updateProperty(accessToken, propertyToSend);

		// success
		if (response.status == 200) {
			showNotification({
				color: "teal",
				autoClose: 5000,
				title: "Opération réussie !",
				message: "Le logement à bien été modifié. Retour à la page précédente."
			});
			form.reset();
			navigate(-1);
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
		<div>
			<Title order={1}>Editer un logement</Title>

			<Card mt="sm" radius="md">
				<form onSubmit={form.onSubmit((values) => sendUpdateProperty(values))}>
					<TextInput
						data-autofocus
						disabled={loading}
						required
						label="Adresse"
						description="Numéro et rue"
						placeholder="3 rue des jardins"
						{...form.getInputProps("street")}
					/>

					<Group spacing="md" mt="md" position="apart">
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							required
							label="Code postal"
							placeholder="35200"
							{...form.getInputProps("postalCode")}
						/>
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							required
							label="Ville"
							placeholder="Rennes"
							{...form.getInputProps("city")}
						/>
					</Group>

					<Group spacing="md" mt="md">
						<NumberInput
							disabled={loading}
							required
							precision={2}
							step={0.1}
							label="Surface"
							placeholder="50"
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
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
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							{...form.getInputProps("lotNumber")}
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

					<Select
						disabled={loading}
						label="Image de couverture"
						description="Image s'affichant dans les différents menus"
						placeholder="Veuillez choisir"
						icon={<Photo size={18} />}
						{...form.getInputProps("image")}
						mt="md"
						data={imagesList.map((img) => ({ value: img, label: img }))}
						onChange={(value) => form.setFieldValue("image", value!)}
					/>

					{form.values["image"] != "" && (
						<PreviewImage token={accessToken} property={property} imgName={form.values["image"]} />
					)}

					<Group position="center" mt="lg">
						<Button leftIcon={<DeviceFloppy />} color="teal" type="submit" loading={loading}>
							Enregistrer
						</Button>
						<Button leftIcon={<X />} color="gray" onClick={() => navigate(-1)} disabled={loading}>
							Annuler
						</Button>
					</Group>
				</form>
			</Card>
		</div>
	);
};

export default EditPropertyPage;

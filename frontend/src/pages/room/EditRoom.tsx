import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Center, Group, Image, Loader, NumberInput, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Text } from "@mantine/core";
import { DeviceFloppy, Photo, X } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { getImagesList, getObjectImage } from "../../api/ImagesConsumer";
import { useAuthContext } from "../../components/AuthProvider";
import { showNotification } from "@mantine/notifications";
import { Room } from "../../api/models/room";
import useRoom from "../../hooks/useRoom";
import { updateRoom } from "../../api/RoomConsumer";

const PreviewImage = ({ token, room, imgName }: { token: string; room: Room; imgName: string }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		(async () => {
			const imgBlob = await getObjectImage(token, "room", room.id, imgName);
			setUrl(URL.createObjectURL(imgBlob));
		})();
	}, [imgName]);

	return (
		<Center mt="md" style={{ marginLeft: "auto", marginRight: "auto" }}>
			<Image src={url} height={300} width="auto" />
		</Center>
	);
};

const EditRoomPage = () => {
	let { id } = useParams();
	const { accessToken } = useAuthContext();
	const [room] = useRoom(id);
	const [imagesList, setImagesList] = useState([] as string[]);
	const [fetchedImageList, setFetchedImageList] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			image: "",
			rent: 0.0,
			charges: 0.0,
			caution: 0.0,
			surface: 0.0
		},

		validate: {}
	});

	useEffect(() => {
		if (!room) return;

		const imageUrl = imagesList.length > 0 ? room.image : "";

		form.setValues({
			image: imageUrl,
			rent: room.rent,
			charges: room.charges,
			caution: room.caution,
			surface: room.surface
		});

		// fetch images
		(async () => {
			const names = await getImagesList(accessToken, "room", room.id);
			setImagesList(names);
			setFetchedImageList(true);
		})();
	}, [room]);

	// show loader if data is not ready
	if (room == undefined || fetchedImageList == false) {
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);
	}

	const sendUpdateRoom = async (values: any) => {
		form.clearErrors();
		setLoading(true);

		let roomToSend: Room = {
			...room,
			image: values["image"],
			rent: values["rent"],
			charges: values["charges"],
			caution: values["caution"],
			surface: values["surface"]
		};
		console.log(roomToSend);
		const response = await updateRoom(accessToken, roomToSend);

		// success
		if (response.status == 200) {
			showNotification({
				color: "teal",
				autoClose: 5000,
				title: "Opération réussie !",
				message: "La chambre à bien été modifié. Retour à la page précédente."
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
			<Title order={1}>Editer une chambre</Title>

			<Card mt="sm" radius="md">
				<form onSubmit={form.onSubmit((values) => sendUpdateRoom(values))}>
					<Group spacing="md" mt="md" position="apart">
						<NumberInput
							disabled={loading}
							required
							precision={2}
							step={0.1}
							label="Loyer"
							description="Loyer mensuel hors charges"
							placeholder="620"
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							rightSection={
								<Text color="dimmed" weight={400} size="sm">
									€
								</Text>
							}
							{...form.getInputProps("rent")}
						/>
						<NumberInput
							disabled={loading}
							required
							precision={2}
							step={0.1}
							label="Charges"
							description="Charges mensuelles"
							placeholder="40"
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							rightSection={
								<Text color="dimmed" weight={400} size="sm">
									€
								</Text>
							}
							{...form.getInputProps("charges")}
						/>
					</Group>

					<NumberInput
						disabled={loading}
						required
						precision={2}
						step={0.1}
						label="Surface"
						placeholder="50"
						rightSection={
							<Text color="dimmed" weight={400} size="sm">
								m²
							</Text>
						}
						{...form.getInputProps("surface")}
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
						<PreviewImage token={accessToken} room={room} imgName={form.values["image"]} />
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

export default EditRoomPage;

import { Box, Button, Center, Group, Loader, Tabs, Title, useMantineTheme, Text } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "tabler-icons-react";
import { getPropertyInfos } from "../api/PropertyConsumer";
import { useAuthContext } from "../components/AuthProvider";
import useRoom from "../hooks/useRoom";
import { Property } from "../api/models/property";
import PhotoGallery from "../components/PhotoGallery";
import RoomInfos from "./room/RoomInfos";

const RoomPage = () => {
	let { id } = useParams();

	const { accessToken } = useAuthContext();
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const navigate = useNavigate();
	const [room] = useRoom(id);
	const [property, setProperty] = useState<Property>();

	// fetch property infos
	useEffect(() => {
		if (!room) return;

		(async () => setProperty(await getPropertyInfos(accessToken, room.property_id)))();
	}, [room, id]);

	if (room == undefined || property == undefined)
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);

	return (
		<>
			<Group position="apart">
				<div>
					<Title order={1} color={colorScheme == "dark" ? theme.colors.dark[0] : theme.colors.dark[8]}>
						Chambre de {room.surface}m²
					</Title>
					<Text size="lg" color="dimmed">
						Loyer: {room.rent}€/mois - Charges: {room.charges}€/mois
					</Text>
				</div>
				<Box>
					<Button
						fullWidth
						leftIcon={<Pencil />}
						onClick={() => navigate("/management/room/" + room.id + "/edit")}>
						Editer
					</Button>
				</Box>
			</Group>

			<Tabs variant="outline" mt="lg" grow>
				<Tabs.Tab label="Informations">
					<RoomInfos room={room} />
				</Tabs.Tab>
				<Tabs.Tab label="Photos">
					<PhotoGallery
						objectType="room"
						objectId={room.id}
						archiveName={property.address + " - " + room.surface + "m2"}
					/>
				</Tabs.Tab>
				<Tabs.Tab label="Transactions">Transactions</Tabs.Tab>
			</Tabs>
		</>
	);
};

export default RoomPage;

import { Box, Button, Center, Group, Loader, Tabs, Title, useMantineTheme, Text } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "tabler-icons-react";
import { useAuthContext } from "../components/AuthProvider";
import PhotoGallery from "../components/PhotoGallery";
import RoomInfos from "./room/RoomInfos";
import { getRoomInfos } from "../api/RoomConsumer";
import useTenant from "../hooks/useTenant";
import { Room } from "../api/models/room";

const TenantPage = () => {
	let { id } = useParams();

	const { accessToken } = useAuthContext();
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const navigate = useNavigate();
	const [tenant] = useTenant(id);
	const [room, setRoom] = useState<Room>();

	// fetch property infos
	useEffect(() => {
		if (!tenant) return;

		(async () => setRoom(await getRoomInfos(accessToken, tenant.room_id)))();
	}, [tenant, id]);

	if (tenant == undefined || room == undefined)
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
						{tenant.fullname}
					</Title>
					<Text size="lg" color="dimmed">
						Loyer: {room.rent}€/mois - Charges: {room.charges}€/mois
					</Text>
				</div>
				<Box>
					<Button
						fullWidth
						leftIcon={<Pencil />}
						onClick={() => navigate("/management/tenant/" + tenant.id + "/edit")}>
						Editer
					</Button>
				</Box>
			</Group>

			<Tabs variant="outline" mt="lg" grow>
				<Tabs.Tab label="Informations">
					<RoomInfos room={room} />
				</Tabs.Tab>
				<Tabs.Tab label="Photos">
					<PhotoGallery objectType="tenant" objectId={tenant.id} archiveName={tenant.fullname} />
				</Tabs.Tab>
				<Tabs.Tab label="Transactions">Transactions</Tabs.Tab>
			</Tabs>
		</>
	);
};

export default TenantPage;

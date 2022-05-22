import { Box, Button, Center, Group, Loader, Tabs, Text, Title, useMantineTheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil } from "tabler-icons-react";
import { Property } from "../api/models/property";
import { Room } from "../api/models/room";
import { Tenant } from "../api/models/tenant";
import { getPropertyInfos } from "../api/PropertyConsumer";
import { getRoomInfos } from "../api/RoomConsumer";
import { getTenantInfos } from "../api/TenantConsumer";
import { useAuthContext } from "../components/AuthProvider";

const PropertyPage = () => {
	let { id } = useParams();

	const { accessToken } = useAuthContext();
	const [property, setProperty] = useState<Property>();
	const [rooms, setRooms] = useState<Room[]>();
	const [tenants, setTenants] = useState<Tenant[]>();
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();

	// fetch the property infos
	useEffect(() => {
		if (!id) return;
		(async () => setProperty(await getPropertyInfos(accessToken, id)))();
	}, [id]);

	// fetch rooms infos
	useEffect(() => {
		if (!id) return;
		if (!property) return;

		(async () => {
			const rooms = (
				await Promise.all(property.rooms.map((room_id) => getRoomInfos(accessToken, room_id)))
			).filter((room) => room != undefined) as Room[];

			setRooms(rooms);
		})();
	}, [id, property]);

	// fetch tenants infos
	useEffect(() => {
		if (!id) return;
		if (!property) return;

		(async () => {
			const tenants = (
				await Promise.all(property.tenants.map((tenant_id) => getTenantInfos(accessToken, tenant_id)))
			).filter((tenant) => tenant != undefined) as Tenant[];

			setTenants(tenants);
		})();
	}, [id, property]);

	if (property == undefined || rooms == undefined || tenants == undefined)
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);

	const maxRent =
		rooms.length > 0
			? rooms.map((room) => room.rent + room.charges).reduce((sum: number, current: number) => sum + current)
			: 0;

	return (
		<>
			<Group position="apart">
				<div>
					<Title order={1} color={colorScheme == "dark" ? theme.colors.dark[0] : theme.colors.dark[8]}>
						{property.address}
					</Title>
					<Text size="lg" color="dimmed">
						{property.type == "full" ? "Logement intégral" : "Colocation"} - {maxRent}€ de loyer maximal
						mensuel
					</Text>
				</div>
				<Box>
					<Button fullWidth leftIcon={<Pencil />}>
						Editer
					</Button>
				</Box>
			</Group>

			<Tabs variant="outline" mt="lg" grow>
				<Tabs.Tab label="Informations">Info tab</Tabs.Tab>
				<Tabs.Tab label="Chambres">Chambre</Tabs.Tab>
				<Tabs.Tab label="Locataires">Locataires</Tabs.Tab>
			</Tabs>
		</>
	);
};

export default PropertyPage;

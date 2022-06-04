import { Box, Button, Center, Group, Loader, Tabs, Text, Title, useMantineTheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "tabler-icons-react";
import { Room } from "../api/models/room";
import { Tenant } from "../api/models/tenant";
import { getRooms } from "../api/RoomConsumer";
import { getTenantInfos } from "../api/TenantConsumer";
import { useAuthContext } from "../components/AuthProvider";
import PhotoGallery from "../components/PhotoGallery";
import useProperty from "../hooks/useProperty";
import PropertyInfos from "./property/PropertyInfos";
import RoomList from "./property/RoomList";
import TenantList from "./property/TenantList";

const PropertyPage = () => {
	let { id } = useParams();

	const { accessToken } = useAuthContext();
	const [property] = useProperty(id);
	const [rooms, setRooms] = useState<Room[]>();
	const [tenants, setTenants] = useState<Tenant[]>();
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const navigate = useNavigate();

	// fetch rooms and tenants infos
	useEffect(() => {
		if (!id) return;
		if (!property) return;

		(async () => {
			setRooms(await getRooms(accessToken, property.rooms));
		})();

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
					<Button
						fullWidth
						leftIcon={<Pencil />}
						onClick={() => navigate("/management/property/" + property.id + "/edit")}>
						Editer
					</Button>
				</Box>
			</Group>

			<Tabs variant="outline" mt="lg" grow>
				<Tabs.Tab label="Informations">
					<PropertyInfos property={property} />
				</Tabs.Tab>
				<Tabs.Tab label="Photos">
					<PhotoGallery objectType="property" objectId={property.id} archiveName={property.address} />
				</Tabs.Tab>
				<Tabs.Tab label="Chambres">
					<RoomList rooms={rooms} />
				</Tabs.Tab>
				<Tabs.Tab label="Locataires">
					<TenantList tenants={tenants} />
				</Tabs.Tab>
			</Tabs>
		</>
	);
};

export default PropertyPage;

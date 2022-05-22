import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../api/PropertyConsumer";
import { useAuthContext } from "../components/AuthProvider";
import { Property } from "../api/models/property";
import { Card, Center, Loader, Image, Text, Group, Button, SimpleGrid, useMantineTheme } from "@mantine/core";
import { Eye, Pencil, SquarePlus } from "tabler-icons-react";
import AddPropertyModal from "../components/AddPropertyModal";
import { useColorScheme } from "@mantine/hooks";
import "../css/propertylist.css";

interface PropertyCardProps {
	property: Property;
}

const AddPropertyCard = (props: any) => {
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);

	return (
		<>
			<AddPropertyModal
				opened={opened}
				onClose={() => setOpened(false)}
				onCreate={() => {
					setOpened(false);
				}}
			/>
			<Card
				className="add_prop_container"
				onClick={() => setOpened(true)}
				style={{ width: "100%", cursor: "pointer", padding: 0, minHeight: "200px" }}>
				<Center style={{ width: "100%", height: "100%" }}>
					<Group direction="column" position="center">
						<SquarePlus
							size={48}
							color={colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.dark[6]}
						/>
						<Text color="dimmed" weight={400}>
							Ajouter un logement
						</Text>
					</Group>
				</Center>
			</Card>
		</>
	);
};

const PropertyCard = ({ property }: PropertyCardProps) => {
	const navigate = useNavigate();
	const nbRooms = property.rooms.length;
	const nbTenants = property.tenants.length;

	return (
		<Card shadow="sm" p="lg">
			<Card.Section>
				<div style={{ border: "1px solid #373a40", borderBottom: "" }}>
					<Image alt="Flat image" src={property.image} height={200} withPlaceholder />
				</div>
			</Card.Section>

			<Text weight={500} mt="md">
				{property.address}
			</Text>
			<Text size="sm" color="dimmed">{`${nbRooms} chambre${nbRooms > 1 ? "s" : ""} - ${nbTenants} locataire${
				nbTenants > 1 ? "s" : ""
			}`}</Text>

			<SimpleGrid cols={2}>
				<Button
					leftIcon={<Eye />}
					variant="light"
					color="blue"
					fullWidth
					mt="md"
					onClick={() => navigate("/management/property/" + property.id)}>
					Voir
				</Button>
				<Button leftIcon={<Pencil />} variant="light" color="teal" fullWidth mt="md">
					Editer
				</Button>
			</SimpleGrid>
		</Card>
	);
};

const PropertyList = () => {
	const { accessToken } = useAuthContext();
	const [properties, setProperties] = useState<Property[]>();
	const [loading, setLoading] = useState(true);

	const updateProperties = async () => {
		setLoading(true);

		const fetched_p = await getProperties(accessToken);
		// sort by surface
		fetched_p.sort((a, b) => {
			if (a.surface < b.surface) return 1;
			if (a.surface > b.surface) return -1;
			return 0;
		});

		setProperties(fetched_p);
		setLoading(false);
	};

	useEffect(() => {
		updateProperties();
	}, []);

	if (loading)
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);

	return (
		<SimpleGrid cols={2} spacing="sm">
			{properties?.map((property: Property) => {
				return <PropertyCard property={property} />;
			})}
			<AddPropertyCard />
		</SimpleGrid>
	);
};

export default PropertyList;
import { useMantineTheme, Card, Center, Group, SimpleGrid, Button, Text, Image } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePlus, Eye, Pencil } from "tabler-icons-react";
import { getObjectImage } from "../../api/ImagesConsumer";
import { Tenant } from "../../api/models/tenant";
import { useAuthContext } from "../../components/AuthProvider";
import AddRoomModal from "../../components/modals/AddRoomModal";

interface TenantListProps {
	tenants: Tenant[];
}
interface TenantCardProps {
	tenant: Tenant;
	token: string;
}

const AddTenantCard = () => {
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);

	return (
		<>
			<AddRoomModal
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
							Ajouter un locataire
						</Text>
					</Group>
				</Center>
			</Card>
		</>
	);
};

const TenantCard = ({ tenant, token }: TenantCardProps) => {
	const navigate = useNavigate();

	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		(async () => {
			const blob = await getObjectImage(token, "tenant", tenant.id, tenant.image);
			setImageUrl(URL.createObjectURL(blob));
		})();
	}, [tenant]);

	return (
		<Card shadow="sm" p="lg">
			<Card.Section>
				<div style={{ border: "1px solid #373a40", borderBottom: "" }}>
					<Image alt="Flat image" src={imageUrl} height={200} withPlaceholder />
				</div>
			</Card.Section>

			<Text weight={500} mt="md">
				{tenant.fullname}
			</Text>
			<Text size="sm" color="dimmed">
				Email: {tenant.email} - Tel: {tenant.tel}
			</Text>

			<SimpleGrid cols={2}>
				<Button
					leftIcon={<Eye />}
					variant="light"
					color="blue"
					fullWidth
					mt="md"
					onClick={() => navigate("/management/tenant/" + tenant.id)}>
					Voir
				</Button>
				<Button
					leftIcon={<Pencil />}
					variant="light"
					color="teal"
					fullWidth
					mt="md"
					onClick={() => navigate("/management/tenant/" + tenant.id + "/edit")}>
					Editer
				</Button>
			</SimpleGrid>
		</Card>
	);
};

const TenantList = ({ tenants }: TenantListProps) => {
	const { accessToken } = useAuthContext();

	return (
		<SimpleGrid cols={2} spacing="sm">
			{tenants.map((tenant: Tenant, idx: number) => {
				return <TenantCard key={idx} token={accessToken} tenant={tenant} />;
			})}
			<AddTenantCard />
		</SimpleGrid>
	);
};

export default TenantList;

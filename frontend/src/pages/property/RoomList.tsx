import { useMantineTheme, Card, Center, Group, SimpleGrid, Button, Text, Image } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePlus, Eye, Pencil } from "tabler-icons-react";
import { getObjectImage } from "../../api/ImagesConsumer";
import { Room } from "../../api/models/room";
import { useAuthContext } from "../../components/AuthProvider";
import AddRoomModal from "../../components/modals/AddRoomModal";

interface RoomListProps {
	rooms: Room[];
}
interface RoomCardProps {
	room: Room;
	token: string;
}

const AddRoomCard = (props: any) => {
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
							Ajouter une chambre
						</Text>
					</Group>
				</Center>
			</Card>
		</>
	);
};

const RoomCard = ({ room, token }: RoomCardProps) => {
	const navigate = useNavigate();

	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		(async () => {
			const blob = await getObjectImage(token, "room", room.id, room.image);
			setImageUrl(URL.createObjectURL(blob));
		})();
	}, [room]);

	return (
		<Card shadow="sm" p="lg">
			<Card.Section>
				<div style={{ border: "1px solid #373a40", borderBottom: "" }}>
					<Image alt="Flat image" src={imageUrl} height={200} withPlaceholder />
				</div>
			</Card.Section>

			<Text weight={500} mt="md">
				Chambre de {room.surface}m²
			</Text>
			<Text size="sm" color="dimmed">
				Loyer: {room.rent}€ - Charges: {room.charges}€
			</Text>

			<SimpleGrid cols={2}>
				<Button
					leftIcon={<Eye />}
					variant="light"
					color="blue"
					fullWidth
					mt="md"
					onClick={() => navigate("/management/room/" + room.id)}>
					Voir
				</Button>
				<Button
					leftIcon={<Pencil />}
					variant="light"
					color="teal"
					fullWidth
					mt="md"
					onClick={() => navigate("/management/room/" + room.id + "/edit")}>
					Editer
				</Button>
			</SimpleGrid>
		</Card>
	);
};

const RoomList = ({ rooms }: RoomListProps) => {
	const { accessToken } = useAuthContext();

	return (
		<SimpleGrid cols={2} spacing="sm">
			{rooms.map((room: Room, idx: number) => {
				return <RoomCard key={idx} token={accessToken} room={room} />;
			})}
			<AddRoomCard />
		</SimpleGrid>
	);
};

export default RoomList;
import { BackgroundImage, Button, Card, Center, Group, Image, ImageProps, Text, useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { deleteImages, getImagesArchive, getImagesList, getObjectImage } from "../../api/ImagesConsumer";
import { Property } from "../../api/models/property";
import { useAuthContext } from "../../components/AuthProvider";
import ImageViewer from "react-simple-image-viewer";
import "../../css/misc.css";

import { Download, Pencil, SquarePlus, Trash, X } from "tabler-icons-react";
import { useColorScheme } from "@mantine/hooks";
import AddImagesModal from "../../components/AddImagesModal";

interface PropertyInfosProps {
	property: Property;
}

const ImageThumbnail = ({ url, shouldDelete, ...props }: { url: string; shouldDelete: boolean } & ImageProps) => {
	return (
		<div
			className="hoverable img-cover"
			style={{
				height: 200,
				width: 200,
				overflow: "hidden"
			}}>
			{shouldDelete ? (
				<BackgroundImage src={url}>
					<Center style={{ height: 200, width: 200, backgroundColor: "rgba(255,0,0,0.3)" }}>
						<Trash size={64} color="red" />
					</Center>
				</BackgroundImage>
			) : (
				<Image src={url} withPlaceholder {...props} />
			)}
		</div>
	);
};

const AddImageCard = ({ objectId, refreshImages }: { objectId: string; refreshImages: () => void }) => {
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);

	return (
		<>
			<AddImagesModal
				opened={opened}
				onClose={() => setOpened(false)}
				objectType="property"
				objectId={objectId}
				onUpload={refreshImages}
			/>
			<Card
				className="add_prop_container"
				style={{ width: "200px", cursor: "pointer", padding: 0 }}
				onClick={() => setOpened(true)}>
				<Center style={{ width: "200px", height: "200px" }}>
					<Group direction="column" position="center">
						<SquarePlus
							size={48}
							color={colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.dark[6]}
						/>
						<Text color="dimmed" weight={400}>
							Ajouter une photo
						</Text>
					</Group>
				</Center>
			</Card>
		</>
	);
};

const PropertyInfos = ({ property }: PropertyInfosProps) => {
	const { accessToken } = useAuthContext();
	const [imgUrls, setImgUrls] = useState([] as string[]);
	const [imgFileNames, setImgFileNames] = useState([] as string[]);
	const [fetching, setFetching] = useState(false);

	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	const [imageEditMode, setImageEditMode] = useState("idle");
	const [shouldDelete, setShouldDelete] = useState([] as boolean[]);

	const openImageViewer = useCallback((index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const fetchImages = useCallback(async () => {
		const names = await getImagesList(accessToken, "property", property.id);

		const blobs: Blob[] = new Array(names.length);

		await Promise.all(
			names.map(async (filename, idx) => {
				console.log("Fetching " + filename + "'s data");
				const data = await getObjectImage(accessToken, "property", property.id, filename);
				blobs[idx] = data;
			})
		);

		// TODO: make it async
		setImgFileNames(names);
		setImgUrls(blobs.map((blob) => URL.createObjectURL(blob)));
		setShouldDelete(new Array(blobs.length).fill(false));
	}, [accessToken, imgUrls, fetching]);

	useEffect(() => {
		if (fetching) return;
		if (accessToken == "") return;
		if (imgUrls.length > 0) return;

		setFetching(true);
		fetchImages();
	}, [accessToken, imgUrls, fetching, fetchImages]);

	const downloadPhotos = async () => {
		const blob = await getImagesArchive(accessToken, "property", property.id);
		const href = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = href;
		a.setAttribute("download", property.address + ".zip");
		document.body.appendChild(a);

		// start download
		a.click();

		// clean up
		a.parentNode.removeChild(a);
	};

	const handleClick = (index: number) => {
		if (imageEditMode == "idle") {
			openImageViewer(index);
		} else {
			var shouldDeleteCurrent = [...shouldDelete];
			shouldDeleteCurrent[index] = shouldDeleteCurrent[index] == false;
			setShouldDelete(shouldDeleteCurrent);
		}
	};

	const sendDeleteImages = async () => {
		const toDelete = shouldDelete
			.map((should, idx) => (should ? imgFileNames[idx] : undefined))
			.filter((e) => e != undefined) as string[];
		console.log("Deleting", toDelete);

		const resp = await deleteImages(accessToken, "property", property.id, toDelete);
		console.log(await resp.text());

		// TODO: notification
		await fetchImages();
	};

	return (
		<div>
			<Group position="left" spacing="md">
				{imgUrls.length > 0 &&
					imgUrls.map((url: string, idx: number) => {
						return (
							<div onClick={() => handleClick(idx)} key={idx}>
								<ImageThumbnail url={url} shouldDelete={shouldDelete[idx]} />
							</div>
						);
					})}

				{imageEditMode == "idle" && <AddImageCard objectId={property.id} refreshImages={fetchImages} />}
			</Group>

			{isViewerOpen && (
				<ImageViewer
					src={imgUrls}
					currentIndex={currentImage}
					disableScroll={false}
					closeOnClickOutside={true}
					onClose={closeImageViewer}
				/>
			)}

			<Group mt="xl" position="center">
				{imageEditMode == "idle" ? (
					<>
						<Button leftIcon={<Download />} color="teal" onClick={downloadPhotos}>
							Télécharger le dossier photo
						</Button>
						<Button leftIcon={<Pencil />} color="gray" onClick={() => setImageEditMode("delete")}>
							Modifier les photos
						</Button>
					</>
				) : (
					<>
						<Button
							leftIcon={<Trash />}
							color="red"
							onClick={() => {
								sendDeleteImages();
								setShouldDelete(new Array(imgUrls.length).fill(false));
								setImageEditMode("idle");
							}}>
							Supprimer {shouldDelete.filter(Boolean).length} photo
							{shouldDelete.filter(Boolean).length > 1 && "s"}
						</Button>
						<Button
							leftIcon={<X />}
							color="gray"
							onClick={() => {
								setShouldDelete(new Array(imgUrls.length).fill(false));
								setImageEditMode("idle");
							}}>
							Annuler
						</Button>
					</>
				)}
			</Group>
		</div>
	);
};

export default PropertyInfos;

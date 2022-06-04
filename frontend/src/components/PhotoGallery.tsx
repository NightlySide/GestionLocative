import {
	ImageProps,
	BackgroundImage,
	Center,
	useMantineTheme,
	Card,
	Group,
	Image,
	Text,
	Button,
	Title
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { Trash, SquarePlus, Download, Pencil, X } from "tabler-icons-react";
import { getImagesArchive, deleteImages, getImagesList, getObjectImage } from "../api/ImagesConsumer";
import { useAuthContext } from "./AuthProvider";
import AddImagesModal from "./modals/AddImagesModal";
import ImageViewer from "react-simple-image-viewer";
import "../css/misc.css";

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

const AddImageCard = ({
	objectType,
	objectId,
	refreshImages,
	onClose
}: {
	objectType: string;
	objectId: string;
	refreshImages: () => void;
	onClose: () => void;
}) => {
	const colorScheme = useColorScheme();
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);

	return (
		<>
			<AddImagesModal
				opened={opened}
				onClose={() => {
					setOpened(false);
					onClose();
				}}
				objectType={objectType}
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

const PhotoGallery = ({
	objectType,
	objectId,
	archiveName
}: {
	objectType: string;
	objectId: string;
	archiveName: string;
}) => {
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

	const downloadPhotos = async () => {
		const blob = await getImagesArchive(accessToken, objectType, objectId);
		const href = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = href;
		a.setAttribute("download", archiveName + ".zip");
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

		const resp = await deleteImages(accessToken, objectType, objectId, toDelete);
		console.log(await resp.text());

		// TODO: notification
		await fetchImages();
	};

	const fetchImages = useCallback(async () => {
		const names = await getImagesList(accessToken, objectType, objectId);

		const blobs: Blob[] = new Array(names.length);

		await Promise.all(
			names.map(async (filename, idx) => {
				const data = await getObjectImage(accessToken, objectType, objectId, filename);
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

	return (
		<>
			<Group position="left" spacing="md">
				{imgUrls.length > 0 &&
					imgUrls.map((url: string, idx: number) => {
						return (
							<div onClick={() => handleClick(idx)} key={idx}>
								<ImageThumbnail url={url} shouldDelete={shouldDelete[idx]} />
							</div>
						);
					})}

				{(imageEditMode != "idle" || imgFileNames.length == 0) && (
					<AddImageCard
						objectType={objectType}
						objectId={objectId}
						refreshImages={fetchImages}
						onClose={() => setImageEditMode("idle")}
					/>
				)}
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
					imgFileNames.length > 0 && (
						<>
							<Button leftIcon={<Download />} color="teal" onClick={downloadPhotos}>
								Télécharger le dossier photo
							</Button>

							<Button leftIcon={<Pencil />} color="gray" onClick={() => setImageEditMode("delete")}>
								Modifier les photos
							</Button>
						</>
					)
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
		</>
	);
};

export default PhotoGallery;

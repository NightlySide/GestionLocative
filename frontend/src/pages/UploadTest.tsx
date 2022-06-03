import { Button, Group, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { getImagesList, getObjectImage, uploadImages } from "../api/ImagesConsumer";
import { useAuthContext } from "../components/AuthProvider";
import FileDropper from "../components/FileDropper";

const UploadedPhoto = ({ imgBlob }: { imgBlob: Blob }) => {
	const url = URL.createObjectURL(imgBlob);

	return <Image src={url} withPlaceholder onLoad={() => URL.revokeObjectURL(url)} height={200} />;
};

const UploadTest = () => {
	const { accessToken } = useAuthContext();
	const [files, setFiles] = useState([] as File[]);
	const propertyId = "a42ebfd7-2357-43cf-8648-ad5248428055";

	const [propertyImages, setPropertyImages] = useState([] as Blob[]);

	// TODO: check duplicates in upload list & duplicates on server
	const sendFiles = async () => {
		const response = await uploadImages(accessToken, propertyId, "property", files);
		console.log(response);
	};

	useEffect(() => {
		if (accessToken == "") return;
		if (propertyImages.length > 0) return;

		console.log("Fetching filenames");

		(async () => {
			const names = await getImagesList(accessToken, "property", propertyId);

			const blobs: Blob[] = [];

			await Promise.all(
				names.map(async (filename) => {
					console.log("Fetching " + filename + "'s data");
					const data = await getObjectImage(accessToken, "property", propertyId, filename);
					blobs.push(data);
				})
			);

			// TODO: make it async
			setPropertyImages(blobs);
		})();
	}, [accessToken, propertyImages]);

	return (
		<>
			<FileDropper files={files} setFiles={setFiles} loading={false} />
			<Button fullWidth mt="lg" onClick={sendFiles} disabled={files.length == 0}>
				Envoyer
			</Button>

			<Group mt="lg" position="apart">
				{propertyImages.length > 0 &&
					propertyImages.map((imageBlob: Blob, idx: number) => {
						return <UploadedPhoto key={idx} imgBlob={imageBlob} />;
					})}
			</Group>
		</>
	);
};

export default UploadTest;

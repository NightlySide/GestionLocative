import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import { uploadImages } from "../api/ImagesConsumer";
import { useAuthContext } from "./AuthProvider";
import FileDropper from "./FileDropper";

interface AddImagesModalProps {
	opened: boolean;
	objectType: string;
	objectId: string;
	onClose: () => void;
	onUpload?: () => void;
}

const AddImagesModal = (props: AddImagesModalProps) => {
	const { accessToken } = useAuthContext();
	const [files, setFiles] = useState([] as File[]);
	const [loading, setLoading] = useState(false);

	const sendPhotos = async () => {
		setLoading(true);
		const response = await uploadImages(accessToken, props.objectId, props.objectType, files);
		console.log(await response.json());
		props.onUpload();
		props.onClose();
		setFiles([]);
		setLoading(false);
	};

	return (
		<Modal
			opened={props.opened}
			onClose={props.onClose}
			title="Ajouter des images"
			centered
			transition="slide-down"
			closeOnClickOutside={false}
			size="xl">
			<FileDropper files={files} setFiles={setFiles} loading={loading} />

			<Button fullWidth color="teal" mt="xl" onClick={sendPhotos} disabled={loading || files.length == 0}>
				Uploader les photos
			</Button>
		</Modal>
	);
};

export default AddImagesModal;

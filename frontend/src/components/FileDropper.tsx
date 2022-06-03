import { Group, Text, useMantineTheme, MantineTheme, Image } from "@mantine/core";
import { Upload, Photo, X, Icon as TablerIcon } from "tabler-icons-react";
import { Dropzone, DropzoneProps, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { humanFileSize } from "../utils";

export enum ErrorCode {
	FileInvalidType = "file-invalid-type",
	FileTooLarge = "file-too-large",
	FileTooSmall = "file-too-small",
	TooManyFiles = "too-many-files"
}

export interface FileError {
	message: string;
	code: ErrorCode | string;
}

export interface FileRejection {
	file: File;
	errors: FileError[];
}

function getIconColor(status: DropzoneStatus, acceptedFiles: File[], theme: MantineTheme) {
	return acceptedFiles.length > 0
		? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
		: status.rejected
		? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
		: theme.colorScheme === "dark"
		? theme.colors.dark[0]
		: theme.colors.gray[7];
}

function ImageUploadIcon({
	status,
	acceptedFiles,
	...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus } & { acceptedFiles: File[] }) {
	if (acceptedFiles.length > 0) {
		return <Upload {...props} />;
	}

	if (status.rejected) {
		return <X {...props} />;
	}

	return <Photo {...props} />;
}

const UploadedPhoto = ({ file }: { file: File }) => {
	const [url, setUrl] = useState("");
	useEffect(() => {
		(async () => {
			const buffer = await file.arrayBuffer();
			const blob = new Blob([buffer]);
			setUrl(URL.createObjectURL(blob));
		})();
	}, [file]);

	return <Image src={url} withPlaceholder onLoad={() => URL.revokeObjectURL(url)} height={200} />;
};

export const dropzoneChildren = (status: DropzoneStatus, acceptedFiles: File[], theme: MantineTheme) => (
	<Group position="center" spacing="sm" direction="column">
		<Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
			<ImageUploadIcon
				status={status}
				acceptedFiles={acceptedFiles}
				style={{ color: getIconColor(status, acceptedFiles, theme) }}
				size={80}
			/>
			<div>
				<Text size="xl" inline>
					Glissez-déposez des images dans cette zone pour les téléverser
				</Text>
				<Text size="sm" color="dimmed" inline mt={7}>
					Choisissez jusqu'à 20 images, chaque fichier ne doit pas faire plus de 2Mo.
				</Text>
			</div>
		</Group>
		{acceptedFiles.length > 0 ? (
			<>
				<div>
					<Text size="md" inline>
						{acceptedFiles.length} Fichier{acceptedFiles.length > 1 ? "s" : ""} à téléverser :
					</Text>
					{acceptedFiles.map((file) => (
						<Text key={file.name} inline color="dimmed" mt="md" size="sm">
							{file.name} ({humanFileSize(file.size, true)})
						</Text>
					))}
				</div>
				<Group direction="row" mt="md" spacing="md">
					{acceptedFiles.map((file) => (
						<UploadedPhoto key={file.name} file={file} />
					))}
				</Group>
			</>
		) : (
			<></>
		)}
	</Group>
);

const FileDropper = ({
	files,
	setFiles,
	loading
}: {
	files: File[];
	setFiles: (files: File[]) => void;
	loading: boolean;
}) => {
	const theme = useMantineTheme();

	const rejectNotification = (files: FileRejection[]) => {
		const fileList: string = files
			.map((rejection) => {
				const errorMsg = rejection.errors.map((error) => error.message).join(", ");
				return `${rejection.file.name} (${errorMsg})`;
			})
			.join(", ");
		showNotification({
			title: "Echec de téléversement",
			message: "Les images suivantes ne respectent pas les consignes:" + fileList,
			color: "red",
			autoClose: 5000
		});
	};

	return (
		<Dropzone
			onDrop={(files) => setFiles(files)}
			onReject={(files) => rejectNotification(files)}
			maxSize={2 * 1024 ** 2}
			multiple
			accept={IMAGE_MIME_TYPE}
			loading={loading}>
			{(status) => dropzoneChildren(status, files, theme)}
		</Dropzone>
	);
};

export default FileDropper;

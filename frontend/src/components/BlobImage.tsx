import { Image, ImageProps } from "@mantine/core";

const BlobImage = ({ blob, ...rest }: { blob: Blob } & ImageProps) => {
	const url = URL.createObjectURL(blob);

	return <Image src={url} withPlaceholder onLoad={() => URL.revokeObjectURL(url)} {...rest} />;
};

export default BlobImage;

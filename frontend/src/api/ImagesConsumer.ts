import { API_URL } from "./ApiConfig";

export const uploadImages = async (
	token: string,
	objectId: string,
	imgType: string,
	images: File[]
): Promise<Response> => {
	const formData = new FormData();
	images.forEach((image: File) => formData.append("files[]", image));

	const response = await fetch(API_URL + "/" + imgType + "/" + objectId + "/image", {
		method: "post",
		headers: { AccessToken: token },
		body: formData
	});

	return response;
};

export const getImagesList = async (token: string, objectType: string, objectId: string): Promise<string[]> => {
	const response = await fetch(API_URL + "/" + objectType + "/" + objectId + "/image", {
		method: "get",
		headers: { "Content-Type": "application/json", AccessToken: token }
	});

	return await response.json();
};

export const getObjectImage = async (
	token: string,
	objectType: string,
	objectId: string,
	filename: string
): Promise<Blob> => {
	const response = await fetch(API_URL + "/" + objectType + "/" + objectId + "/image" + "/" + filename, {
		method: "get",
		headers: { "Content-Type": "image", AccessToken: token }
	});

	return await response.blob();
};

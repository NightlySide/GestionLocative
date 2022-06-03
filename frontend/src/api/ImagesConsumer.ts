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

export const getImagesArchive = async (token: string, objectType: string, objectId: string): Promise<Blob> => {
	const response = await fetch(API_URL + "/" + objectType + "/" + objectId + "/image_archive", {
		method: "get",
		headers: { "Content-Type": "application/zip", AccessToken: token }
	});

	return await response.blob();
};

export const deleteImages = async (
	token: string,
	objectType: string,
	objectId: string,
	imageNames: string[]
): Promise<Response> => {
	const response = await fetch(API_URL + "/" + objectType + "/" + objectId + "/image", {
		method: "delete",
		headers: { "Content-Type": "application/json", AccessToken: token },
		body: JSON.stringify(imageNames)
	});

	return response;
};

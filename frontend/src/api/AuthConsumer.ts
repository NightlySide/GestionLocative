import { API_URL } from "./ApiConfig";

interface RegisterProps {
	prenom: string;
	nom: string;
	email: string;
	username: string;
	password: string;
}

export const registerUser = async (props: RegisterProps): Promise<Response> => {
	const response = await fetch(API_URL + "/auth/register", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			fullname: `${props.prenom} ${props.nom}`,
			password: props.password,
			email: props.email,
			username: props.username
		})
	});

	return response;
};

interface LoginProps {
	username: string;
	password: string;
}

export const loginUser = async (props: LoginProps): Promise<Response> => {
	const response = await fetch(API_URL + "/auth/login", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({
			password: props.password,
			username: props.username
		})
	});

	return response;
};

export const getUserInfos = async (token: string): Promise<Response> => {
	const response = await fetch(API_URL + "/account/infos", {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});

	return response;
};

export const isTokenValid = async (token: string): Promise<boolean> => {
	const response = await fetch(API_URL + "/auth/healthcheck", {
		headers: { "Content-Type": "application/json", AccessToken: token }
	});

	if (response.status != 200) {
		return false;
	} else {
		const data = await response.json();
		return data["is_token_valid"];
	}
};

export const refreshToken = async (): Promise<string> => {
	const response = await fetch(API_URL + "/auth/refresh", {
		headers: { "Content-Type": "application/json" },
		credentials: "include"
	});

	if (response.status != 200) {
		return "";
	} else {
		const data = await response.json();
		return data["access-token"];
	}
};

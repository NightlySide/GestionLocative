export const HOST =
	process.env.NODE_ENV === "production" ? "https://gestion-locative.ietananas.fr" : "http://localhost";
export const PORT = process.env.NODE_ENV === "production" ? "" : "1234";
export const API_URL = PORT == "" ? `${HOST}/api` : `${HOST}:${PORT}/api`;

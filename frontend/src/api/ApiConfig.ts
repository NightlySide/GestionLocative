export const HOST =
	process.env.NODE_ENV === "production" ? "https://gestion-locative.ietananas.fr/api" : "http://localhost";
export const PORT = process.env.NODE_ENV ? 80 : 1234;
export const API_URL = `${HOST}:${PORT}`;

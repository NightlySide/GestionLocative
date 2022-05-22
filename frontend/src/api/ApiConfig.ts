export const HOST =
	process.env.NODE_ENV === "production" ? "https://api.gestion-locative.ietananas.fr" : "http://localhost";
export const PORT = process.env.NODE_ENV ? 80 : 1234;
export const API_URL = `${HOST}:${PORT}`;

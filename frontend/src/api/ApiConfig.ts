export const HOST = process.env.NODE_ENV === "production" ? "api.gestion-locative.ietananas.fr" : "localhost";
export const PORT = process.env.NODE_ENV ? 80 : 1234;
export const API_URL = `http://${HOST}:${PORT}`;

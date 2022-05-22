import { hideNotification, showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenValid } from "../api/AuthConsumer";
import { useAuthContext } from "./AuthProvider";
import useLogout from "../hooks/useLogout";
import LoadingPage from "../pages/Loading";

// BUG: Double call to /healthcheck with no specific reason
const RequireAuth = ({ children }: any) => {
	const { accessToken, hasTokens } = useAuthContext();
	const logout = useLogout(false);

	const [isLogged, setIsLogged] = useState<undefined | boolean>(undefined);
	const location = useLocation();

	useEffect(() => {
		// if there is no time for login, return
		if (accessToken == "" && hasTokens) return;
		console.log(accessToken == "", hasTokens);

		// else try to check the validity of the token
		(async () => {
			setIsLogged(await isTokenValid(accessToken));
		})();
	}, [accessToken]);

	useEffect(() => {
		if (isLogged != false) return;

		// show notification
		hideNotification("session-expired");
		showNotification({
			id: "session-expired",
			title: "Session expirée",
			color: "red",
			message: "Votre session a expiré. Veuillez vous reconnecter pour continuer d'utiliser l'espace de gestion.",
			autoClose: 10000
		});

		// logout user
		logout();
	}, [isLogged]);

	if (isLogged == undefined) return <LoadingPage />;
	else if (isLogged) return children;
	else {
		return <Navigate to="/" state={{ from: location }} replace />;
	}
};

export default RequireAuth;

import { cleanNotifications, showNotification } from "@mantine/notifications";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/AuthProvider";

const useLogout = (shouldNotify = false) => {
	const { setAccessToken, setHasTokens } = useAuthContext();
	const navigate = useNavigate();

	// TODO: add logout on server side to delete httponly cookie
	return () => {
		setAccessToken("");
		setHasTokens(false);
		Cookies.remove("has-tokens", {
			sameSite: "Strict",
			secure: true
		});

		if (shouldNotify) {
			cleanNotifications();
			showNotification({
				title: "Déconnexion",
				message: "Vous vous êtes déconnecté avec succès. Retour à la page d'accueil.",
				autoClose: 5000,
				color: "teal"
			});
		}
		navigate("/", { replace: true });
	};
};

export default useLogout;

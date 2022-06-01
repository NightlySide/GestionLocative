import { useContext, useEffect } from "react";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { refreshToken } from "../api/AuthConsumer";
import { isTokenExpired } from "../api/JWTUtils";
import Cookies from "js-cookie";

export interface AuthContextT {
	accessToken: string;
	setAccessToken: (token: string) => void;
	hasTokens: boolean;
	setHasTokens: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextT>({
	accessToken: "",
	setAccessToken: () => undefined,
	hasTokens: false,
	setHasTokens: () => undefined
});

export const AuthProvider = ({ children }: any) => {
	const [accessToken, setAccessToken] = useState("");
	const [hasTokens, setHasTokens] = useState(Cookies.get("has-tokens") == "true");

	return (
		<AuthContext.Provider value={{ accessToken, setAccessToken, hasTokens, setHasTokens }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = (shouldRefresh = true): AuthContextT => {
	const context = useContext(AuthContext);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		if (isRefreshing) return;
		if (!context.hasTokens || !shouldRefresh) return;

		// refresh the token if it expires or is not created yet
		if (context.accessToken == "" || isTokenExpired(context.accessToken)) {
			setIsRefreshing(true);
			refreshToken().then((token) => {
				context.setAccessToken(token);
				setIsRefreshing(false);
			});
		}
	}, [context, isRefreshing]);

	return context;
};

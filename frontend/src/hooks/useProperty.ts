import { useState, useEffect } from "react";
import { getPropertyInfos } from "../api/PropertyConsumer";
import { useAuthContext } from "../components/AuthProvider";
import { Property } from "../api/models/property";

const useProperty = (id: string): [Property, (p: Property) => void] => {
	const { accessToken } = useAuthContext();
	const [property, setProperty] = useState<Property>();

	useEffect(() => {
		if (!id) return;
		(async () => setProperty(await getPropertyInfos(accessToken, id)))();
	}, [id]);

	return [property, setProperty];
};

export default useProperty;

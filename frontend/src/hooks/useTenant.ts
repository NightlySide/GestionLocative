import { useState, useEffect } from "react";
import { useAuthContext } from "../components/AuthProvider";
import { Tenant } from "../api/models/tenant";
import { getTenantInfos } from "../api/TenantConsumer";

const useTenant = (id: string): [Tenant, (t: Tenant) => void] => {
	const { accessToken } = useAuthContext();
	const [tenant, setTenant] = useState<Tenant>();

	useEffect(() => {
		if (!id) return;
		(async () => setTenant(await getTenantInfos(accessToken, id)))();
	}, [id]);

	return [tenant, setTenant];
};

export default useTenant;

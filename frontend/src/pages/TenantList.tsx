import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { Tenant } from "../api/models/tenant";
import { getTenants } from "../api/TenantConsumer";
import { useAuthContext } from "../components/AuthProvider";
import TenantList from "./property/TenantList";

const TenantListPage = () => {
	const { accessToken } = useAuthContext();
	const [tenants, setTenants] = useState<Tenant[]>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (accessToken == "") return;

		(async () => {
			setTenants(await getTenants(accessToken));
			setLoading(false);
		})();
	}, [accessToken]);

	if (loading)
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);

	return <TenantList tenants={tenants} />;
};

export default TenantListPage;

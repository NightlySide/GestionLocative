import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import PropertyPage from "./pages/Property";
import EditPropertyPage from "./pages/property/EditProperty";
import PropertyList from "./pages/PropertyList";
import RoomPage from "./pages/Room";
import EditRoomPage from "./pages/room/EditRoom";
import TenantPage from "./pages/Tenant";
import EditTenantPage from "./pages/tenant/EditTenant";
import TenantListPage from "./pages/TenantList";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route
					path="/management"
					element={
						<RequireAuth>
							<Dashboard />
						</RequireAuth>
					}>
					<Route path="property" element={<PropertyList />} />
					<Route path="property/:id" element={<PropertyPage />} />
					<Route path="property/:id/edit" element={<EditPropertyPage />} />
					<Route path="room/:id" element={<RoomPage />} />
					<Route path="room/:id/edit" element={<EditRoomPage />} />
					<Route path="tenants" element={<TenantListPage />} />
					<Route path="tenant/:id" element={<TenantPage />} />
					<Route path="tenant/:id/edit" element={<EditTenantPage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;

import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import PropertyPage from "./pages/Property";
import PropertyList from "./pages/PropertyList";
import UploadTest from "./pages/UploadTest";

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
					<Route path="upload" element={<UploadTest />} />
					<Route path="property" element={<PropertyList />} />
					<Route path="property/:id" element={<PropertyPage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;

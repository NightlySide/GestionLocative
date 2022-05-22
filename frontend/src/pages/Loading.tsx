import { Center, Loader } from "@mantine/core";

const LoadingPage = () => {
	return (
		<Center
			style={{
				width: "100vw",
				height: "100vh"
			}}>
			<Loader color="teal" size="xl" variant="bars" />
		</Center>
	);
};

export default LoadingPage;

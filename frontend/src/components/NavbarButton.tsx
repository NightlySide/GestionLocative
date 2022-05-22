import { useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import "../css/navbarbutton.css";

interface NavbarButtonProps {
	label: string;
	description?: string;
	linkTo?: string;
	icon?: React.ReactNode;
	replaceNav?: boolean;
	barOnTop?: boolean;
}

const NavbarButton = ({ label, description, icon, linkTo, barOnTop }: NavbarButtonProps) => {
	const navigate = useNavigate();

	return (
		<div
			className="navbar_btn_container"
			style={{
				borderTop: barOnTop ? "1px solid #373a40" : "",
				borderBottom: barOnTop ? "" : "1px solid #373a40"
			}}>
			<div className="button" onClick={() => linkTo && navigate(linkTo)}>
				{icon && <div className="icon">{icon}</div>}
				<div className="text">
					<Text className="label">{label}</Text>
					{description && (
						<Text color="dimmed" className="description">
							{description}
						</Text>
					)}
				</div>
			</div>
		</div>
	);
};

export default NavbarButton;

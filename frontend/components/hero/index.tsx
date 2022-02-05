import Image from "next/image";
import HeroImage from "../../public/assets/images/hero_background.jpg";
import styles from "./hero.module.css";

const Hero = () => {
	return (
		<>
			<Image
				className={styles.image}
				src={HeroImage}
				alt="Photo aérienne de maisons"
				height={800}
				objectFit="cover"
			/>
		</>
	);
};

export default Hero;

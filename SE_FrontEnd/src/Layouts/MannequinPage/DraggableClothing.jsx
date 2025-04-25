// DraggableClothing.jsx
import React from "react";
import { motion } from "framer-motion";

{
	/*  
  This component is responsible for rendering draggable clothing items on the mannequin.
  It uses Framer Motion for drag functionality and accepts props for the image source, alt text, and additional styles.
*/
}
function DraggableClothing({ src, alt, style = {} }) {
	return (
		<motion.img
			src={src}
			alt={alt}
			drag
			dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
			style={{
				position: "absolute",
				width: "100%",
				...style,
				touchAction: "none",
			}}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		/>
	);
}

export default DraggableClothing;

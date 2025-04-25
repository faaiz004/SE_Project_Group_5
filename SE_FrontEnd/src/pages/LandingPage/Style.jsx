// src/style.js

export const pageContainer = {
	display: "flex",
	flexDirection: "row",
	width: "100%",
	height: "100vh",
	fontFamily: "sans-serif",
	overflow: "hidden",
};

export const leftContainer = {
	flex: 1,
	backgroundColor: "#f0f0f0",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "1rem",
	overflow: "hidden",
	height: "100%",
	boxSizing: "border-box",
};

export const rightContainer = {
	flex: 1,
	backgroundColor: "#fff",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "2rem",
	overflow: "hidden",
	height: "100%",
	boxSizing: "border-box",
};

export const title = {
	fontSize: "2.5rem",
	fontWeight: 700,
	marginBottom: "0.5rem",
	textAlign: "center",
	color: "#2c3e50",
	lineHeight: 1.2,
};

export const titleHighlight = {
	color: "#F1C40F",
	fontSize: "2.5rem",
	fontWeight: 700,
};

// Subheading
export const subtitle = {
	fontSize: "1rem",
	fontWeight: 400,
	marginBottom: "2rem",
	color: "#555",
	textAlign: "center",
	lineHeight: 1.4,
};

export const collageContainer = {
	position: "relative",
	width: "85%",
	height: "80%",
	maxHeight: "480px",
	margin: "0 auto",
};

// Repositioned images to create a collage with visible gaps
export const collageImage1 = {
	position: "absolute",
	top: "0%",
	left: "0%",
	width: "30%",
	maxWidth: "140px",
	borderRadius: "4px",
	boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
	zIndex: 1,
};

export const collageImage2 = {
	position: "absolute",
	top: "0%",
	left: "38%",
	width: "28%",
	maxWidth: "130px",
	borderRadius: "4px",
	boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
	backgroundColor: "#F1C40F",
	zIndex: 1,
};

export const collageImage3 = {
	position: "absolute",
	top: "28%",
	left: "5%",
	width: "35%",
	maxWidth: "160px",
	borderRadius: "4px",
	boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
	zIndex: 2,
};

export const collageImage4 = {
	position: "absolute",
	top: "25%",
	left: "45%",
	width: "35%",
	maxWidth: "160px",
	borderRadius: "4px",
	boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
	zIndex: 2,
};

// Reincorporated collageImage5 with adjusted positioning
export const collageImage5 = {
	position: "absolute",
	top: "55%",
	left: "25%",
	width: "35%",
	maxWidth: "160px",
	borderRadius: "4px",
	boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
	zIndex: 3,
};

export const mannequinImage = {
	width: "100%",
	maxWidth: "450px",
	height: "auto",
	margin: "0 0 1.5rem 0",
};

export const buttonContainer = {
	display: "flex",
	flexDirection: "column",
	gap: "0.75rem",
	width: "80%",
	maxWidth: "300px",
};

export const signInButton = {
	// This should be renamed to signUpButton in your component
	backgroundColor: "#F1C40F",
	color: "#fff",
	padding: "0.7rem 1rem",
	fontSize: "1rem",
	fontWeight: 600,
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
	width: "100%",
	textAlign: "center",
};

export const orDivider = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	margin: "0.25rem 0",
	color: "#777",
	fontSize: "0.8rem",
};

export const googleButton = {
	backgroundColor: "#000000",
	color: "#fff",
	padding: "0.7rem 1rem",
	fontSize: "0.9rem",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
	width: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "0.5rem",
};

export const googleIcon = {
	width: "18px",
	height: "18px",
	marginRight: "8px",
};

// Add this global style to your root component
export const globalStyles = {
	"*": {
		boxSizing: "border-box",
		margin: 0,
		padding: 0,
	},
	img: {
		maxWidth: "100%",
		height: "auto",
	},
};

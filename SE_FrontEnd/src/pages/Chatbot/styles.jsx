import { styled } from "@mui/material/styles";

export const ChatbotContainer = styled("div")({
	position: "fixed",
	bottom: 20,
	right: 0,
	display: "flex",
	alignItems: "center",
	zIndex: 1000,
});

export const ToggleButton = styled("button")({
	backgroundColor: "#27374D",
	color: "white",
	borderRadius: "50%",
	padding: "10px",
	marginRight: "5px",
	"&:hover": {
		backgroundColor: "#1E293B",
	},
});

export const ChatbotWindow = styled("div")(({ isOpen }) => ({
	position: "fixed",
	bottom: 20,
	right: isOpen ? "0px" : "-350px",
	width: "350px",
	height: "500px",
	backgroundColor: "#fff",
	boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
	borderRadius: "10px 0 0 10px",
	transition: "right 0.3s ease-in-out",
}));

const useStyles = () => {
	return {
		chatbotBox: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
			p: 2,
			boxSizing: "border-box",
			backgroundColor: "#fff",
			borderRadius: "10px",
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			mb: 2,
		},
		title: {
			fontWeight: "bold",
		},
		closeButton: {
			backgroundColor: "#f44336",
			color: "white",
			"&:hover": {
				backgroundColor: "#d32f2f",
			},
		},
		categoryButtons: {
			display: "flex",
			justifyContent: "space-evenly",
			mb: 2,
		},
		categoryButton: {
			textTransform: "none",
		},
		messagesContainer: {
			flexGrow: 1,
			overflowY: "auto",
			p: 1,
			border: "1px solid #ddd",
			borderRadius: "5px",
			mb: 2,
		},
		userMessage: {
			textAlign: "right",
			backgroundColor: "#e1f5fe",
			p: 1,
			borderRadius: "10px",
			mb: 1,
		},
		botMessage: {
			textAlign: "left",
			backgroundColor: "#f1f1f1",
			p: 1,
			borderRadius: "10px",
			mb: 1,
		},
		inputContainer: {
			display: "flex",
			alignItems: "center",
			gap: 1,
		},
		textField: {
			flexGrow: 1,
		},
		sendButton: {
			textTransform: "none",
		},
	};
};

export default useStyles;

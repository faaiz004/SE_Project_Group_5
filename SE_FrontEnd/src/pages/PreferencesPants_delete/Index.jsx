"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Container,
	LinearProgress,
	Grid,
	Card,
	CardMedia,
	CardActionArea,
	Button,
	Snackbar,
	Alert,
	Stack,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import pants1 from "../../assets/StylePreferences/larki1.jpg";
import pants2 from "../../assets/StylePreferences/larki2.png";
import pants3 from "../../assets/StylePreferences/larki4.png";
import pants4 from "../../assets/StylePreferences/larki5.png";
import { submitPreferences } from "../../api/authService";

export default function PreferencesPants() {
	const [selectedPants, setSelectedPants] = useState([]);
	const [showSelectError, setShowSelectError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [showSubmitError, setShowSubmitError] = useState(false);
	const navigate = useNavigate();

	const pantsImages = [pants1, pants2, pants3, pants4];
	const pants = Array.from({ length: 9 }, (_, i) => ({
		id: i + 1,
		name: `Pants ${i + 1}`,
		image: pantsImages[i % 4],
	}));

	const handlePantsSelect = (pantsId) => {
		if (selectedPants.includes(pantsId)) {
			setSelectedPants((prev) => prev.filter((id) => id !== pantsId));
		} else if (selectedPants.length < 3) {
			setSelectedPants((prev) => [...prev, pantsId]);
		} else {
			setShowSelectError(true);
		}
	};

	const handleCloseSelectError = (_, reason) => {
		if (reason === "clickaway") return;
		setShowSelectError(false);
	};

	const handleCloseSubmitError = () => {
		setShowSubmitError(false);
	};

	const handleFinish = async () => {
		setIsSubmitting(true);
		setSubmitError("");
		try {
			const credentials =
				JSON.parse(sessionStorage.getItem("user-credentials")) || {};
			await submitPreferences({ ...credentials, pants: selectedPants });
			navigate("/explore");
		} catch (error) {
			const msg =
				error.response?.data?.error ||
				"Internal server error. Please try again.";
			setSubmitError(msg);
			setShowSubmitError(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box sx={{ position: "relative", minHeight: "100vh" }}>
			{isSubmitting && (
				<LinearProgress
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 2000,
					}}
				/>
			)}

			<Box
				sx={{
					minHeight: "100vh",
					backgroundColor: "#f8f8f8",
					display: "flex",
					flexDirection: "column",
					pt: 3,
					px: 2,
					pb: 6,
				}}>
				{/* Progress bar */}
				<Box sx={{ px: 2, mb: 4 }}>
					<LinearProgress
						variant="determinate"
						value={100}
						sx={{
							height: 8,
							borderRadius: 4,
							backgroundColor: "#e0e0e0",
							"& .MuiLinearProgress-bar": {
								backgroundColor: "#3f51b5",
								borderRadius: 4,
							},
						}}
					/>
				</Box>

				{/* Step indicator */}
				<Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
					Step 5 of 5
				</Typography>

				{/* Main content */}
				<Container maxWidth="md" sx={{ flexGrow: 1 }}>
					<Typography
						variant="h3"
						align="center"
						sx={{ mb: 2, fontWeight: 600 }}>
						Select 3 Pants
					</Typography>

					<Typography
						variant="h6"
						align="center"
						color="text.secondary"
						sx={{ mb: 4 }}>
						Pick the pants that align with your personal style. Choose exactly 3
						to continue.
					</Typography>

					<Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
						<Chip
							label={`${selectedPants.length} of 3 selected`}
							color={selectedPants.length === 3 ? "primary" : "default"}
							sx={{ mb: 3 }}
						/>
					</Box>

					<Grid container spacing={4} justifyContent="center">
						{pants.map((pant) => (
							<Grid item xs={12} sm={6} md={4} key={pant.id}>
								<Card
									elevation={0}
									onClick={() => handlePantsSelect(pant.id)}
									sx={{
										borderRadius: 3,
										overflow: "hidden",
										border: selectedPants.includes(pant.id)
											? "2px solid #3f51b5"
											: "1px solid #e0e0e0",
										transition: "all 0.3s ease",
										cursor: "pointer",
										position: "relative",
										minHeight: 280,
										"&:hover": {
											boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
											transform: "translateY(-4px)",
										},
									}}>
									<CardActionArea>
										<CardMedia
											component="img"
											height="250"
											image={pant.image}
											alt={pant.name}
											sx={{ objectFit: "cover", width: "100%" }}
										/>
										{selectedPants.includes(pant.id) && (
											<CheckCircleIcon
												sx={{
													position: "absolute",
													top: 10,
													right: 10,
													color: "#3f51b5",
													backgroundColor: "white",
													borderRadius: "50%",
													fontSize: 28,
												}}
											/>
										)}
									</CardActionArea>
								</Card>
							</Grid>
						))}
					</Grid>

					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="center"
						sx={{ mt: 6 }}>
						<Button
							variant="outlined"
							size="large"
							sx={{
								px: 4,
								py: 1.5,
								borderColor: "#3f51b5",
								color: "#3f51b5",
								"&:hover": {
									borderColor: "#303f9f",
									backgroundColor: "rgba(63, 81, 181, 0.04)",
								},
							}}
							onClick={() => navigate("/preferences/shirts")}>
							Back
						</Button>
						<Button
							variant="contained"
							size="large"
							disabled={selectedPants.length !== 3 || isSubmitting}
							sx={{
								px: 4,
								py: 1.5,
								backgroundColor: "#3f51b5",
								"&:hover": {
									backgroundColor: "#303f9f",
								},
								"&.Mui-disabled": {
									backgroundColor: "#c5cae9",
									color: "#9fa8da",
								},
							}}
							onClick={handleFinish}>
							Finish
						</Button>
					</Stack>
				</Container>

				{/* Selection error */}
				<Snackbar
					open={showSelectError}
					autoHideDuration={4000}
					onClose={handleCloseSelectError}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
					<Alert
						onClose={handleCloseSelectError}
						severity="error"
						sx={{ width: "100%" }}>
						You can only select 3 pants.
					</Alert>
				</Snackbar>

				{/* Submission error */}
				<Dialog
					open={showSubmitError}
					onClose={handleCloseSubmitError}
					maxWidth="sm"
					fullWidth>
					<DialogTitle
						sx={{
							color: "error.main",
							fontWeight: "bold",
							textAlign: "center",
						}}>
						Submission Failed
					</DialogTitle>
					<DialogContent>
						<Typography variant="h6" align="center" sx={{ my: 2 }}>
							{submitError}
						</Typography>
					</DialogContent>
					<DialogActions sx={{ justifyContent: "center", pb: 3 }}>
						<Button
							variant="contained"
							onClick={handleCloseSubmitError}
							sx={{ px: 4 }}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	);
}

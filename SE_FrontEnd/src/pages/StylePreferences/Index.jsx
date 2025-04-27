import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Container,
	LinearProgress,
	Grid,
	Card,
	CardMedia,
	CardContent,
	CardActionArea,
	Button,
	Stack,
	Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sampleClothes } from "../../api/clothesService";

import modernImg from "../../assets/StylePreferences/larki1.jpg";
import businessImg from "../../assets/StylePreferences/larki2.png";
import oldMoneyImg from "../../assets/StylePreferences/larki4.png";
import casualImg from "../../assets/StylePreferences/larki5.png";

export default function StylePreferences() {
	const navigate = useNavigate();
	const [selectedStyle, setSelectedStyle] = useState(null);
	const [gender, setGender] = useState("male");
	const [images, setImages] = useState({});
	const [loading, setLoading] = useState(true);

	const dynamicStyleOptions = [
		{ id: "Modern", name: "Modern" },
		{ id: "Smart_Casual", name: "Business" },
		{ id: "Old_Money", name: "Old Money" },
		{ id: "Casual_Everyday", name: "Casual" },
	];

	const staticStyleOptions = [
		{ id: "Modern", name: "Modern", image: modernImg },
		{ id: "Smart_Casual", name: "Business", image: businessImg },
		{ id: "Old_Money", name: "Old Money", image: oldMoneyImg },
		{ id: "Casual_Everyday", name: "Casual", image: casualImg },
	];

	useEffect(() => {
		const creds = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
		setGender(creds.gender || "male");

		if (creds.stylePreference) {
			setSelectedStyle(creds.stylePreference);
		}

		if ((creds.gender || "male") === "male") {
			(async () => {
				try {
					const categories = dynamicStyleOptions.map((opt) => opt.id);
					const data = await sampleClothes({
						count: 1,
						categories,
						gender: "male",
						upper: true,
					});
					const imgs = {};
					data.forEach((group) => {
						let raw = group.items[0]?.imageUrl || "";
						raw = raw.replace("/thumbnails/thumbnails/", "/thumbnails/");
						if (group.category === "Old_Money") {
							raw =
								"https://swipe-fit.s3.ap-southeast-2.amazonaws.com/thumbnails/clothes/09a2bef1-f9d8-44fc-a082-d382e977c928.png";
						}
						imgs[group.category] = raw;
					});
					setImages(imgs);
				} catch (err) {
					console.error("Failed to fetch style previews:", err);
				} finally {
					setLoading(false);
				}
			})();
		} else {
			setLoading(false);
		}
	}, []);

	const updateSession = (newData) => {
		const current =
			JSON.parse(sessionStorage.getItem("user-credentials")) || {};
		sessionStorage.setItem(
			"user-credentials",
			JSON.stringify({ ...current, ...newData })
		);
	};

	const handleStyleSelect = (style) => {
		setSelectedStyle(style);
		updateSession({ stylePreference: style });
	};

	const renderCommonLayout = (cards) => (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: "#f8f8f8",
				display: "flex",
				flexDirection: "column",
				pt: 3,
				px: 2,
			}}>
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

			<Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
				Step 3 of 3
			</Typography>

			<Container maxWidth="lg" sx={{ flexGrow: 1 }}>
				<Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
					Select your style
				</Typography>
				<Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
					preferences
				</Typography>

				<Grid container spacing={4} justifyContent="center">
					{cards}
				</Grid>

				<Stack direction="row" spacing={2} justifyContent="center" mt={6}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/preferences/weight")}
						sx={{
							px: 4,
							py: 1.5,
							borderColor: "#3f51b5",
							color: "#3f51b5",
							"&:hover": {
								borderColor: "#303f9f",
								backgroundColor: "rgba(63, 81, 181, 0.04)",
							},
						}}>
						Back
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => {
							if (selectedStyle) {
								navigate("/explore");
							}
						}}
						disabled={!selectedStyle}
						sx={{
							px: 4,
							py: 1.5,
							backgroundColor: "#3f51b5",
							"&:hover": { backgroundColor: "#303f9f" },
							"&.Mui-disabled": {
								backgroundColor: "#c5cae9",
								color: "#9fa8da",
							},
						}}>
						Next
					</Button>
				</Stack>
			</Container>
		</Box>
	);

	if (loading) {
		return renderCommonLayout(
			dynamicStyleOptions.map((_, idx) => (
				<Grid item xs={12} sm={6} md={4} key={idx}>
					<Skeleton
						variant="rectangular"
						height={300}
						sx={{ borderRadius: 2 }}
					/>
					<Skeleton sx={{ mt: 1, width: "300px" }} />
				</Grid>
			))
		);
	}

	if (gender === "female") {
		return renderCommonLayout(
			staticStyleOptions.map((style) => (
				<Grid item xs={12} sm={6} md={4} key={style.id}>
					<Card
						elevation={0}
						onClick={() => handleStyleSelect(style.id)}
						sx={{
							borderRadius: 2,
							overflow: "hidden",
							border:
								selectedStyle === style.id
									? "2px solid #3f51b5"
									: "1px solid #e0e0e0",
							transition: "all 0.3s ease",
							cursor: "pointer",
							"&:hover": {
								boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
								transform: "translateY(-4px)",
							},
						}}>
						<CardActionArea>
							<CardMedia
								component="img"
								height="300"
								image={style.image}
								alt={style.name}
								sx={{ objectFit: "cover" }}
							/>
							<CardContent sx={{ textAlign: "center", py: 2 }}>
								<Typography variant="h5" sx={{ fontWeight: 500 }}>
									{style.name}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			))
		);
	}

	return renderCommonLayout(
		dynamicStyleOptions.map((style) => (
			<Grid item xs={12} sm={6} md={4} key={style.id}>
				<Card
					elevation={0}
					onClick={() => handleStyleSelect(style.id)}
					sx={{
						borderRadius: 2,
						overflow: "hidden",
						border:
							selectedStyle === style.id
								? "2px solid #3f51b5"
								: "1px solid #e0e0e0",
						transition: "all 0.3s ease",
						cursor: "pointer",
						"&:hover": {
							boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
							transform: "translateY(-4px)",
						},
					}}>
					<CardActionArea>
						<CardMedia
							component="img"
							height="300"
							image={images[style.id] || ""}
							alt={style.name}
							sx={{ objectFit: "cover" }}
						/>
						<CardContent sx={{ textAlign: "center", py: 2 }}>
							<Typography variant="h5" sx={{ fontWeight: 500 }}>
								{style.name}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Grid>
		))
	);
}

// AllClothesSearch.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Card,
	CardMedia,
	Button,
	Skeleton,
	TextField,
	InputAdornment,
	IconButton,
	Link,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import {
	fetchOutfits,
	saveClothes,
	unsaveClothes,
	getSavedClothes,
	getUserPreferences,
} from "../../api/clothesService";

import {
	pageContainer,
	headerContainer,
	logoStyle,
	headerIconsContainer,
	searchContainer,
	contentContainer,
	titleStyle,
	gridContainer,
	cardStyle,
	buttonStyle,
	buttonContainerStyle,
	searchInputStyle,
} from "./styles";
import { fetchTextureByName } from "../../api/texturesService";
// import { useNavigate } from "react-router-dom";

export default function AllClothesSearch() {
	const navigate = useNavigate();
	const location = useLocation();
	const category = new URLSearchParams(location.search).get("category");

	const [savedStates, setSavedStates] = useState({});
	const [cartItems, setCartItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [userPrefs, setUserPrefs] = useState(null);

	const {
		data: clothes = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["allClothes"],
		queryFn: fetchOutfits,
	});

	const handleImageClick = async (item) => {
		const textureName = `${item.name}_texture`; // append _texture
		try {
			const texture = await fetchTextureByName(textureName);
			// console.log("Texture found:", texture);
			const textureUrl = texture.signedUrl;
			const isUpper = texture.upper;
			// const itemName = item.name;
			const itemPrice = item.price;
			const itemID = item._id;
			const itemUrl = item.imageUrl;
			console.log("item", item);
			// navigate to mannequin page and maybe store in session/local state
			sessionStorage.setItem("selectedTextureUrl", textureUrl);
			sessionStorage.setItem("selectedTextureName", item.name);
			sessionStorage.setItem("selectedModelisUpper", isUpper);
			sessionStorage.setItem("itemPrice", itemPrice);
			sessionStorage.setItem("itemID", itemID);
			sessionStorage.setItem("itemUrl", itemUrl);
			// sessionStorage.setItem("itemName", itemName);

			navigate("/mannequin");
		} catch (err) {
			console.error("Texture not found for", textureName, err);
			alert("Texture not found for this outfit.");
		}
	};
	useEffect(() => {
		const stored = JSON.parse(sessionStorage.getItem("cart")) || [];
		setCartItems(stored);
		(async () => {
			try {
				const saved = await getSavedClothes();
				const init = {};
				saved.forEach((c) => {
					init[c._id] = true;
				});
				setSavedStates(init);
				const prefs = await getUserPreferences();
				setUserPrefs(prefs);
			} catch (e) {
				console.error("Init failed:", e);
			}
		})();
	}, []);

	const saveMutation = useMutation({
		mutationFn: saveClothes,
		onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: false })),
	});

	const unsaveMutation = useMutation({
		mutationFn: unsaveClothes,
		onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: true })),
	});

	const handleToggleSave = (id) => {
		const was = !!savedStates[id];
		setSavedStates((s) => ({ ...s, [id]: !was }));
		was ? unsaveMutation.mutate(id) : saveMutation.mutate(id);
	};

	const handleAddToCart = (item, imageUrl) => {
		if (cartItems.some((ci) => ci.productId === item._id)) return;
		const entry = {
			productId: item._id,
			name: item.name,
			brand: item.brand,
			size: item.size,
			category: item.category,
			price: item.price,
			imageUrl,
			quantity: 1,
		};
		const updated = [...cartItems, entry];
		sessionStorage.setItem("cart", JSON.stringify(updated));
		setCartItems(updated);
	};

	const filteredClothes = clothes.filter((item) => {
		return category
			? item.category?.toLowerCase() === category.toLowerCase()
			: true;
	});

	const nameMap = new Map();
	const uniqueClothes = filteredClothes.filter((item) => {
		const key = item.name;
		if (nameMap.has(key)) return false;
		nameMap.set(key, true);
		return true;
	});

	const matchesPrefs = (item) => {
		if (!userPrefs) return false;
		return (
			item.size === userPrefs.size &&
			item.style === userPrefs.style &&
			item.gender === userPrefs.gender
		);
	};

	const personalizedClothes = uniqueClothes.filter(matchesPrefs);
	const otherClothes = uniqueClothes.filter((item) => !matchesPrefs(item));

	const renderCard = (item) => {
		const raw = item.signedImageUrl || item.imageUrl || "";
		const imageUrl = raw.replace("/thumbnails/thumbnails/", "/thumbnails/");
		const isSaved = !!savedStates[item._id];
		const isInCart = cartItems.some((ci) => ci.productId === item._id);

		return (
			<Card key={item._id} sx={cardStyle}>
				<CardMedia
					component="img"
					src={imageUrl}
					alt={item.name || "Clothing item"}
					height="220"
					imgProps={{ loading: "lazy" }}
					sx={{ objectFit: "contain", cursor: "pointer" }}
					onClick={() => handleImageClick(item)}
				/>
				<Box sx={buttonContainerStyle}>
					<Button
						fullWidth
						size="small"
						onClick={() => handleAddToCart(item, imageUrl)}
						disabled={isInCart}
						sx={{
							...buttonStyle,
							"&.Mui-disabled": { bgcolor: "#2D333A", color: "#fff" },
						}}>
						{isInCart ? "Added" : "Add to Cart"}
					</Button>
					<Button
						fullWidth
						size="small"
						onClick={() => handleToggleSave(item._id)}
						sx={buttonStyle}>
						{isSaved ? "Unsave" : "Save"}
					</Button>
				</Box>
			</Card>
		);
	};

	const renderContent = () => {
		if (isLoading) {
			return (
				<Box sx={gridContainer}>
					{[...Array(8)].map((_, i) => (
						<Skeleton
							key={i}
							variant="rectangular"
							height={280}
							sx={{ borderRadius: 2 }}
						/>
					))}
				</Box>
			);
		}

		if (isError) return <Typography>Error: {error.message}</Typography>;

		if (uniqueClothes.length === 0) {
			return (
				<Box sx={{ textAlign: "center", py: 4 }}>
					<Typography variant="h6">No items match your search</Typography>
					<Typography color="text.secondary">
						Try adjusting your search criteria
					</Typography>
				</Box>
			);
		}

		return (
			<>
				{personalizedClothes.length > 0 && (
					<>
						<Typography variant="h6" sx={{ mb: 2 }}>
							For You ❤️
						</Typography>
						<Box sx={gridContainer}>
							{personalizedClothes.map((item) => (
								<Box key={item._id}>{renderCard(item)}</Box>
							))}
						</Box>
					</>
				)}
				<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
					All Results
				</Typography>
				<Box sx={gridContainer}>
					{otherClothes.map((item) => (
						<Box key={item._id}>{renderCard(item)}</Box>
					))}
				</Box>
			</>
		);
	};

	return (
		<Box sx={pageContainer}>
			<Box
				sx={{
					width: "100%",
					backgroundColor: "#ffffff",
					borderBottom: "1px solid #e0e0e0",
				}}>
				<Box sx={headerContainer}>
					<Link href="/explore" sx={logoStyle}>
						Swipe-Fit
					</Link>
					<Box sx={headerIconsContainer}>
						<IconButton>
							<PersonOutlineIcon />
						</IconButton>
						<IconButton onClick={() => navigate("/cart")}>
							<ShoppingCartOutlinedIcon />
							{cartItems.length > 0 && (
								<Box
									sx={{
										position: "absolute",
										top: 0,
										right: 0,
										bgcolor: "#2D333A",
										color: "white",
										width: 16,
										height: 16,
										borderRadius: "50%",
										fontSize: 12,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									{cartItems.length}
								</Box>
							)}
						</IconButton>
					</Box>
				</Box>
			</Box>

			<Box sx={searchContainer}>
				<TextField
					placeholder="Search clothes by name, brand, or category..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					variant="outlined"
					size="small"
					sx={searchInputStyle}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			</Box>

			<Box sx={contentContainer}>
				<Typography sx={titleStyle}>
					Results for: <strong>{category || "All Clothes"}</strong>
				</Typography>
				{renderContent()}
			</Box>
		</Box>
	);
}

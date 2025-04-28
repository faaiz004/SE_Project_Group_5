import {
	useState,
	useRef,
	useEffect,
	Suspense,
	useCallback,
	useMemo,
} from "react";
import {
	Box,
	Typography,
	IconButton,
	CircularProgress,
	Button,
	Alert,
	Snackbar,
} from "@mui/material";
import {
	ArrowBack,
	ArrowForward,
	Refresh as RefreshIcon,
	ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	OrbitControls,
	Environment,
	useGLTF,
	useTexture,
	Box as DreiBox,
	Cylinder,
} from "@react-three/drei";
import * as THREE from "three";
import { useQuery } from "@tanstack/react-query";
import { fetchOutfits } from "../../api/clothesService";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

// --- Helper Components ---
function CanvasLoader() {
	return (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "rgba(240, 240, 240, 0.9)",
				zIndex: 20,
			}}>
			<CircularProgress />
			<Typography variant="body1" sx={{ mt: 2 }}>
				Loading 3D Models...
			</Typography>
		</Box>
	);
}

function FallbackClothing({ textureUrl, position, type }) {
	const isUpper = type === "upper";
	const [fbTextureError, setFbTextureError] = useState(false);
	const safeTextureUrl =
		textureUrl || (isUpper ? "/textures/texture.png" : "/textures/red.png");

	const texture = useTexture(
		safeTextureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			setFbTextureError(true);
		}
	);

	const materialProps = useMemo(
		() => ({
			map: fbTextureError ? null : texture,
			roughness: 0.7,
			metalness: 0.1,
			color: fbTextureError ? "#888888" : "#ffffff",
		}),
		[texture, fbTextureError]
	);

	if (isUpper) {
		return (
			<group position={position}>
				{/* Torso */}
				<DreiBox
					args={[0.8, 0.5, 0.4]}
					position={[0, 0.25, 0]}
					castShadow
					receiveShadow>
					<meshStandardMaterial {...materialProps} />
				</DreiBox>
				{/* Arms */}
				<Cylinder
					args={[0.1, 0.1, 0.6]}
					position={[-0.5, 0.1, 0]}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
					receiveShadow>
					<meshStandardMaterial {...materialProps} />
				</Cylinder>
				<Cylinder
					args={[0.1, 0.1, 0.6]}
					position={[0.5, 0.1, 0]}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
					receiveShadow>
					<meshStandardMaterial {...materialProps} />
				</Cylinder>
			</group>
		);
	}

	return (
		<group position={position}>
			{/* Legs */}
			<Cylinder
				args={[0.15, 0.15, 1]}
				position={[-0.2, -0.5, 0]}
				castShadow
				receiveShadow>
				<meshStandardMaterial {...materialProps} />
			</Cylinder>
			<Cylinder
				args={[0.15, 0.15, 1]}
				position={[0.2, -0.5, 0]}
				castShadow
				receiveShadow>
				<meshStandardMaterial {...materialProps} />
			</Cylinder>
		</group>
	);
}

function ClothingModel({ geometryUrl, textureUrl, scale, position, isUpper }) {
	const [modelError, setModelError] = useState(false);
	const [textureError, setTextureError] = useState(false);
	const safeTextureUrl = textureUrl || "/textures/placeholder.png";

	useEffect(() => {
		setModelError(false);
		setTextureError(false);
	}, [geometryUrl, safeTextureUrl]);

	const { scene: geometryScene, error: gltfError } = useGLTF(geometryUrl, true);

	useEffect(() => {
		if (gltfError) {
			setModelError(true);
		}
	}, [gltfError, geometryUrl]);

	const texture = useTexture(
		safeTextureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			setTextureError(true);
		}
	);

	if (modelError) {
		return (
			<FallbackClothing
				textureUrl={safeTextureUrl}
				position={position}
				type={isUpper ? "upper" : "lower"}
			/>
		);
	}

	const clonedScene = useMemo(() => {
		if (!geometryScene) return null;

		const clone = geometryScene.clone();
		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;

				if (!child.material) {
					return;
				}

				const applyTexture = (material) => {
					if (!textureError && material.map !== undefined) {
						material.map = texture;
						if (
							texture &&
							(texture.format === THREE.RGBAFormat ||
								safeTextureUrl.endsWith(".png"))
						) {
							material.transparent = true;
							material.alphaTest = 0.1;
						} else {
							material.transparent = false;
						}
						material.needsUpdate = true;
					} else if (textureError) {
						material.color.set("#888888");
						material.map = null;
						material.needsUpdate = true;
					}
				};

				if (Array.isArray(child.material)) {
					child.material.forEach(applyTexture);
				} else {
					applyTexture(child.material);
				}
			}
		});
		clone.scale.set(...scale);
		clone.position.set(...position);
		return clone;
	}, [geometryScene, texture, scale, position, safeTextureUrl, textureError]);

	return useMemo(() => {
		if (!clonedScene) {
			return (
				<FallbackClothing
					textureUrl={safeTextureUrl}
					position={position}
					type={isUpper ? "upper" : "lower"}
				/>
			);
		}
		return <primitive object={clonedScene} dispose={null} />;
	}, [clonedScene, isUpper, safeTextureUrl, position]);
}

function SceneContent({ upperData, lowerData, setAutoRotate, isAutoRotating }) {
	const groupRef = useRef();
	const controlsRef = useRef();
	const ROTATION_SPEED = 0.1;

	useFrame((state, delta) => {
		if (isAutoRotating && groupRef.current) {
			groupRef.current.rotation.y += delta * ROTATION_SPEED;
		}
	});

	useEffect(() => {
		const controls = controlsRef.current;
		if (controls) {
			const handleStart = () => setAutoRotate(false);
			const handleEnd = () => setAutoRotate(true);

			controls.addEventListener("start", handleStart);
			controls.addEventListener("end", handleEnd);
			return () => {
				if (controls && typeof controls.removeEventListener === "function") {
					try {
						controls.removeEventListener("start", handleStart);
						controls.removeEventListener("end", handleEnd);
					} catch (error) {
						/* silent fail */
					}
				}
			};
		}
	}, [setAutoRotate]);

	if (
		!upperData ||
		!lowerData ||
		!upperData.textureUrl ||
		!lowerData.textureUrl
	) {
		return <CanvasLoader />;
	}

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.7} />
			<directionalLight
				position={[5, 8, 5]}
				intensity={1.5}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-far={50}
				shadow-camera-left={-10}
				shadow-camera-right={10}
				shadow-camera-top={10}
				shadow-camera-bottom={-10}
				shadow-bias={-0.0005}
			/>
			<directionalLight position={[-5, 2, -2]} intensity={0.3} />

			{/* Environment */}
			<Environment preset="city" />

			{/* Ground Plane */}
			<mesh
				receiveShadow
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -1.5, 0]}>
				<planeGeometry args={[20, 20]} />
				<meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} />
			</mesh>

			{/* Models Group */}
			<group ref={groupRef}>
				<ClothingModel
					key={`upper-${upperData.geometryUrl}-${
						upperData.textureUrl || "fallback"
					}`}
					geometryUrl={upperData.geometryUrl}
					textureUrl={upperData.textureUrl}
					scale={upperData.scale}
					position={upperData.position}
					isUpper={true}
				/>
				<ClothingModel
					key={`lower-${lowerData.geometryUrl}-${
						lowerData.textureUrl || "fallback"
					}`}
					geometryUrl={lowerData.geometryUrl}
					textureUrl={lowerData.textureUrl}
					scale={lowerData.scale}
					position={lowerData.position}
					isUpper={false}
				/>
			</group>

			{/* Controls */}
			<OrbitControls
				ref={controlsRef}
				makeDefault
				enablePan={true}
				enableZoom={true}
				target={[0, 0, 0]}
				minDistance={2}
				maxDistance={10}
			/>
		</>
	);
}

// --- Main Component ---
export default function ClothingViewer() {
	const navigate = useNavigate();

	// State management
	const [indices, setIndices] = useState({ upper: 0, lower: 0 });
	const [canvasKey, setCanvasKey] = useState(Date.now());
	const [isAutoRotating, setAutoRotate] = useState(true);
	const [snackbar, setSnackbar] = useState({
		message: "",
		show: false,
		severity: "success",
	});

	// Texture state - consolidated
	const [dynamicTextures, setDynamicTextures] = useState({
		upper: { url: null, name: "Default Shirt" },
		lower: { url: null, name: "Default Pants" },
	});

	// Data fetching
	const { data } = useQuery({
		queryKey: ["clothesAll"],
		queryFn: fetchOutfits,
	});

	// Texture data management
	const [textureStore, setTextureStore] = useState({
		upper: {},
		lower: {},
	});

	// Helper functions
	const getUniqueByName = useCallback((items) => {
		const seen = new Set();
		return (
			items?.filter((item) => {
				if (!item || seen.has(item.name)) return false;
				seen.add(item.name);
				return true;
			}) || []
		);
	}, []);

	const fetchTextureUrl = useCallback(async (textureName) => {
		try {
			const response = await fetch(
				`http://localhost:8000/api/textures/${textureName}`
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			return data.signedUrl;
		} catch (err) {
			return "/textures/placeholder.png";
		}
	}, []);

	const selectedTextureUrl = sessionStorage.getItem("selectedTextureUrl");
	const isUpper = sessionStorage.getItem("selectedModelisUpper") === "true";
	const selectedName = sessionStorage.getItem("selectedTextureName");
	const itemPrice = sessionStorage.getItem("itemPrice");
	const itemImageUrl = sessionStorage.getItem("itemUrl");
	console.log("itemImageUrl", itemImageUrl);
	// const itemID = sessionStorage.getItem("itemID");
	// Load texture from session storage
	useEffect(() => {
		setDynamicTextures({
			upper: {
				url: isUpper
					? selectedTextureUrl || "/textures/texture.png"
					: "/textures/red.png",
				name: isUpper ? selectedName || "Default Shirt" : "Default Shirt",
			},
			lower: {
				url: !isUpper
					? selectedTextureUrl || "/textures/texture.png"
					: "/textures/jeans.png",
				name: !isUpper ? selectedName || "Default Pants" : "Default Jeans",
			},
		});
	}, []);

	// Fetch all textures when data is loaded
	useEffect(() => {
		if (!Array.isArray(data)) return;

		const fetchAllTextures = async (items, type) => {
			const texturesMap = {};
			await Promise.all(
				items.map(async (item) => {
					const textureName = `${item.name}_texture`;
					const url = await fetchTextureUrl(textureName);
					texturesMap[item.name] = url;
				})
			);

			setTextureStore((prev) => ({
				...prev,
				[type]: texturesMap,
			}));
		};

		const uniqueUppers = getUniqueByName(data.filter((item) => item.upper));
		const uniqueLowers = getUniqueByName(data.filter((item) => item.lower));

		fetchAllTextures(uniqueUppers, "upper");
		fetchAllTextures(uniqueLowers, "lower");
	}, [data, fetchTextureUrl, getUniqueByName]);

	// Generate clothing options
	const generateOptions = useCallback(
		(items, textures, dynamicTexture, modelConfig) => {
			if (!Array.isArray(items)) return [];

			const regularList = getUniqueByName(items)
				.filter((item) => textures[item.name])
				.map((item) => ({
					name: item.name,
					textureUrl: textures[item.name],
					...modelConfig,
					price: item.price || 0,
					imageUrl: item.imageUrl || "",
				}));

			if (
				dynamicTexture.url &&
				dynamicTexture.url !== "/textures/texture.png"
			) {
				return [
					{
						name: dynamicTexture.name,
						textureUrl: dynamicTexture.url,
						...modelConfig,
						price: itemPrice,
						imageUrl: itemImageUrl,
						isDynamic: true,
					},
					...regularList,
				];
			}

			return regularList;
		},
		[getUniqueByName, itemPrice, itemImageUrl]
	);

	// Create clothing options lists
	const upperClothingOptions = useMemo(
		() =>
			generateOptions(
				data?.filter((item) => item.upper),
				textureStore.upper,
				dynamicTextures.upper,
				{
					geometryUrl: "/models/bomber_jacket.glb",
					scale: [1, 1, 1],
					position: [0, -0.3, 0],
				}
			),
		[data, textureStore.upper, dynamicTextures.upper, generateOptions]
	);

	const lowerClothingOptions = useMemo(
		() =>
			generateOptions(
				data?.filter((item) => item.lower),
				textureStore.lower,
				dynamicTextures.lower,
				{
					geometryUrl: "/models/leg.glb",
					scale: [1, 1, 1],
					position: [0, -0.6, 0],
				}
			),
		[data, textureStore.lower, dynamicTextures.lower, generateOptions]
	);

	// Reset upper index if options change
	useEffect(() => {
		if (
			indices.upper >= upperClothingOptions.length &&
			upperClothingOptions.length > 0
		) {
			setIndices((prev) => ({ ...prev, upper: 0 }));
		}
	}, [upperClothingOptions, indices.upper]);

	// WebGL Context Lost Handler
	const handleContextLost = useCallback((e) => {
		e.preventDefault();
		setAutoRotate(false);
		setCanvasKey(Date.now());
		setSnackbar({
			message: "WebGL context lost. Attempting to reload viewer.",
			severity: "warning",
			show: true,
		});
	}, []);

	// Auto-rotation management
	useEffect(() => {
		if (snackbar.severity !== "warning") {
			setAutoRotate(true);
		}
	}, [indices, snackbar.severity]);

	// Navigation handlers
	const handleItemChange = useCallback(
		(type, direction) => {
			const options =
				type === "upper" ? upperClothingOptions : lowerClothingOptions;
			if (!options.length) return;

			setIndices((prev) => {
				const currentIndex = prev[type];
				const optionsLength = options.length;
				let newIndex;

				if (direction === "next") {
					newIndex = (currentIndex + 1) % optionsLength;
				} else {
					newIndex = (currentIndex - 1 + optionsLength) % optionsLength;
				}

				return { ...prev, [type]: newIndex };
			});
		},
		[upperClothingOptions, lowerClothingOptions]
	);

	// Notification helper
	const showNotification = useCallback((message, severity = "success") => {
		setSnackbar({
			message,
			severity,
			show: true,
		});
	}, []);

	// Get current items safely
	const safeGetItem = useCallback((items, index) => {
		if (!items.length) return null;
		const safeIndex = Math.max(0, Math.min(index, items.length - 1));
		return items[safeIndex];
	}, []);

	const currentUpperData = safeGetItem(upperClothingOptions, indices.upper);
	const currentLowerData = safeGetItem(lowerClothingOptions, indices.lower);

	// Loading state check
	if (
		!currentUpperData ||
		!currentLowerData ||
		!dynamicTextures.upper.url ||
		!dynamicTextures.lower.url
	) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}>
				<CircularProgress />
				<Typography sx={{ ml: 2 }}>Loading Outfit...</Typography>
			</Box>
		);
	}

	// Action handlers
	const handleResetLook = () => {
		setIndices({ upper: 0, lower: 0 });
		setAutoRotate(true);
		showNotification("Look reset to default", "info");
	};

	const handleAddToCart = () => {
		const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

		const itemsToAdd = [
			{
				productId: currentUpperData.name,
				name: currentUpperData.name,
				category: "Upper",
				price: currentUpperData.price || 0,
				imageUrl: currentUpperData.imageUrl,
				quantity: 1,
			},
			{
				productId: currentLowerData.name,
				name: currentLowerData.name,
				category: "Lower",
				price: currentLowerData.price || 0,
				imageUrl: currentLowerData.imageUrl,
				quantity: 1,
			},
		];

		const updatedCart = [...cart];

		itemsToAdd.forEach((item) => {
			const exists = updatedCart.some((ci) => ci.productId === item.productId);
			if (!exists) updatedCart.push(item);
		});

		sessionStorage.setItem("cart", JSON.stringify(updatedCart));
		showNotification("Current outfit added to cart!");
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") return;
		setSnackbar((prev) => ({ ...prev, show: false }));
	};

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: "#f5f5f7",
			}}>
			{/* Header */}
			<Box
				sx={{
					p: { xs: 2, md: 3 },
					textAlign: "center",
					backgroundColor: "#fff",
					borderBottom: "1px solid #eaeaea",
				}}>
				{/* Home Button */}
				<IconButton
					onClick={() => navigate("/explore")}
					sx={{ position: "absolute", left: 10, top: 10 }}>
					<HomeIcon />
				</IconButton>

				<Typography
					variant="h4"
					sx={{
						fontWeight: 600,
						color: "#333",
						fontSize: { xs: "1.5rem", md: "2.125rem" },
					}}>
					SwipeFit Dressroom
				</Typography>
				<Typography
					variant="body1"
					sx={{
						mt: 1,
						color: "#666",
						fontSize: { xs: "0.875rem", md: "1rem" },
					}}>
					Select items and see them combined in 3D
				</Typography>

				{/* Cart Button */}
				<IconButton
					onClick={() => navigate("/cart")}
					sx={{
						position: "absolute",
						right: 10,
						top: 10,
						backgroundColor: "#fff",
						border: "1px solid #eaeaea",
						borderRadius: "50%",
						padding: 1,
					}}>
					<ShoppingCartOutlinedIcon />
				</IconButton>
			</Box>

			{/* Main Content Area */}
			<Box
				sx={{
					flexGrow: 1,
					position: "relative",
					display: "flex",
					overflow: "hidden",
				}}>
				{/* 3D Canvas Area */}
				<Box
					sx={{
						flexGrow: 1,
						position: "relative",
						minHeight: "300px",
					}}>
					{currentUpperData && currentLowerData && (
						<Suspense fallback={<CanvasLoader />}>
							<Canvas
								key={canvasKey}
								shadows
								camera={{ position: [0, 0.5, 4], fov: 50 }}
								gl={{ preserveDrawingBuffer: true, antialias: true }}
								onCreated={({ gl }) => {
									gl.domElement.addEventListener(
										"webglcontextlost",
										handleContextLost,
										false
									);
								}}
								style={{
									background: "linear-gradient(to bottom, #eef2f7, #ffffff)",
								}}>
								<SceneContent
									upperData={currentUpperData}
									lowerData={currentLowerData}
									isAutoRotating={isAutoRotating}
									setAutoRotate={setAutoRotate}
								/>
							</Canvas>
						</Suspense>
					)}
				</Box>

				{/* Right Side Action Buttons (Desktop) */}
				<Box
					sx={{
						width: { md: "90px" },
						display: { xs: "none", md: "flex" },
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 4,
						p: 2,
						borderLeft: "1px solid #eaeaea",
						backgroundColor: "#fff",
						flexShrink: 0,
					}}>
					{[
						{
							icon: <RefreshIcon />,
							label: "Reset",
							handler: handleResetLook,
						},
						{
							icon: <ShoppingCartIcon />,
							label: "Add Cart",
							handler: handleAddToCart,
						},
					].map((action) => (
						<Box
							key={action.label}
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}>
							<IconButton
								onClick={action.handler}
								sx={{
									width: "50px",
									height: "50px",
									border: "1px solid #eaeaea",
									backgroundColor: "#f9f9f9",
									"&:hover": { backgroundColor: "#f0f0f0" },
								}}>
								{action.icon}
							</IconButton>
							<Typography
								variant="caption"
								sx={{ mt: 0.5, textAlign: "center" }}>
								{action.label}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>

			{/* Selection Controls Footer */}
			<Box
				sx={{
					p: 2,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: { xs: 1, md: 2 },
					flexWrap: "wrap",
					backgroundColor: "#fff",
					borderTop: "1px solid #eaeaea",
				}}>
				{/* Upper Clothing Selector */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: 1,
						px: { xs: 1, md: 3 },
						border: "1px solid #eaeaea",
						borderRadius: "8px",
						backgroundColor: "#fff",
						minWidth: { xs: "150px", sm: "220px" },
					}}>
					<Typography
						variant="subtitle1"
						sx={{
							mr: { xs: 1, md: 2 },
							fontWeight: 500,
							fontSize: { xs: "0.875rem", md: "1rem" },
						}}>
						Shirt:
					</Typography>
					<Typography
						variant="body2"
						sx={{
							mr: 1,
							flexGrow: 1,
							textAlign: "center",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontSize: { xs: "0.8rem", md: "0.875rem" },
						}}>
						{currentUpperData.name}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
						<IconButton
							onClick={() => handleItemChange("upper", "prev")}
							size="small"
							sx={{ mr: 0.5 }}
							aria-label="Previous Shirt">
							<ArrowBack fontSize="small" />
						</IconButton>
						<IconButton
							onClick={() => handleItemChange("upper", "next")}
							size="small"
							aria-label="Next Shirt">
							<ArrowForward fontSize="small" />
						</IconButton>
					</Box>
				</Box>

				{/* Lower Clothing Selector */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: 1,
						px: { xs: 1, md: 3 },
						border: "1px solid #eaeaea",
						borderRadius: "8px",
						backgroundColor: "#fff",
						minWidth: { xs: "150px", sm: "220px" },
					}}>
					<Typography
						variant="subtitle1"
						sx={{
							mr: { xs: 1, md: 2 },
							fontWeight: 500,
							fontSize: { xs: "0.875rem", md: "1rem" },
						}}>
						Pants:
					</Typography>
					<Typography
						variant="body2"
						sx={{
							mr: 1,
							flexGrow: 1,
							textAlign: "center",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontSize: { xs: "0.8rem", md: "0.875rem" },
						}}>
						{currentLowerData.name}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
						<IconButton
							onClick={() => handleItemChange("lower", "prev")}
							size="small"
							sx={{ mr: 0.5 }}
							aria-label="Previous Pants">
							<ArrowBack fontSize="small" />
						</IconButton>
						<IconButton
							onClick={() => handleItemChange("lower", "next")}
							size="small"
							aria-label="Next Pants">
							<ArrowForward fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</Box>

			{/* Bottom Action Buttons (Mobile) */}
			<Box
				sx={{
					display: { xs: "flex", md: "none" },
					justifyContent: "space-around",
					p: 1.5,
					gap: 1,
					borderTop: "1px solid #eaeaea",
					backgroundColor: "#fff",
				}}>
				<Button
					variant="outlined"
					startIcon={<ShoppingCartIcon />}
					onClick={handleAddToCart}
					size="small"
					sx={{
						flex: 1,
						py: 1,
						borderColor: "#ccc",
						color: "#555",
						fontSize: "0.75rem",
					}}>
					Add Cart
				</Button>
			</Box>

			{/* Notification Snackbar */}
			<Snackbar
				open={snackbar.show}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}

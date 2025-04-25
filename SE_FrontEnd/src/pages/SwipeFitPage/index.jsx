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
	Favorite as FavoriteIcon,
	Refresh as RefreshIcon,
	ShoppingCart as ShoppingCartIcon,
	Save as SaveIcon,
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
import { fetchOutfits} from "../../api/clothesService";

// const textureUrlA = sessionStorage.getItem("selectedTextureUrl");
// console.log("Texture URL A:", textureUrlA);

// --- Helper Components (CanvasLoader, Fallbacks, ClothingModel, SceneContent) ---

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

function FallbackUpperClothing({ textureUrl, position }) {
	const [fbTextureError, setFbTextureError] = useState(false);
	// Ensure textureUrl is valid before calling useTexture
	const safeTextureUrl = textureUrl || "/textures/placeholder.png"; // Use placeholder if null/undefined

	const texture = useTexture(
		safeTextureUrl, // Use the safe URL
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			console.warn(`Fallback texture failed to load: ${safeTextureUrl}`, error);
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

	// Rest of FallbackUpperClothing...
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
			{/* Left arm */}
			<Cylinder
				args={[0.1, 0.1, 0.6]}
				position={[-0.5, 0.1, 0]}
				rotation={[0, 0, Math.PI / 2]}
				castShadow
				receiveShadow>
				<meshStandardMaterial {...materialProps} />
			</Cylinder>
			{/* Right arm */}
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

function FallbackLowerClothing({ textureUrl, position }) {
	const [fbTextureError, setFbTextureError] = useState(false);
	const safeTextureUrl = textureUrl || "/textures/red.png"; // Use placeholder

	const texture = useTexture(
		safeTextureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			console.warn(`Fallback texture failed to load: ${safeTextureUrl}`, error);
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

	// Rest of FallbackLowerClothing...
	return (
		<group position={position}>
			{/* Left leg */}
			<Cylinder
				args={[0.15, 0.15, 1]}
				position={[-0.2, -0.5, 0]}
				castShadow
				receiveShadow>
				<meshStandardMaterial {...materialProps} />
			</Cylinder>
			{/* Right leg */}
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
	// Ensure textureUrl is valid before calling useTexture/useGLTF
	const safeTextureUrl = textureUrl || "/textures/placeholder.png";

	useEffect(() => {
		setModelError(false);
		setTextureError(false);
	}, [geometryUrl, safeTextureUrl]);

	const { scene: geometryScene, error: gltfError } = useGLTF(geometryUrl, true);

	useEffect(() => {
		if (gltfError) {
			console.error(`Failed to load model: ${geometryUrl}`, gltfError);
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
			// This is the onError callback for useTexture
			console.error(`Failed to load texture: ${safeTextureUrl}`, error);
			setTextureError(true);
		}
	);

	if (modelError) {
		console.log(
			`Rendering fallback for ${
				isUpper ? "upper" : "lower"
			} clothing due to model load error.`
		);
		return isUpper ? (
			<FallbackUpperClothing textureUrl={safeTextureUrl} position={position} />
		) : (
			<FallbackLowerClothing textureUrl={safeTextureUrl} position={position} />
		);
	}

	const clonedScene = useMemo(() => {
		if (!geometryScene) return null;

		const clone = geometryScene.clone();
		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;

				// Ensure material exists before trying to apply texture
				if (!child.material) {
					console.warn("Mesh found without material:", child);
					// Optionally assign a default material
					// child.material = new THREE.MeshStandardMaterial({ color: 'grey' });
					return; // Skip texture application if no material
				}

				const applyTexture = (material) => {
					// Check if 'map' property exists on the material
					if (!textureError && material.map !== undefined) {
						material.map = texture; // Use the loaded texture
						// Adjust transparency based on texture format or file extension
						if (
							texture &&
							(texture.format === THREE.RGBAFormat ||
								safeTextureUrl.endsWith(".png"))
						) {
							material.transparent = true;
							material.alphaTest = 0.1; // Adjust as needed, helps with PNG edges
						} else {
							material.transparent = false;
						}
						material.needsUpdate = true;
					} else if (textureError) {
						// Optional: Handle texture error on material, e.g., set a default color
						material.color.set("#888888"); // Grey color if texture fails
						material.map = null; // Ensure no old map is used
						material.needsUpdate = true;
					}
					// Add other material properties if needed
					// material.roughness = 0.5;
					// material.metalness = 0.1;
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
	}, [geometryScene, texture, scale, position, safeTextureUrl, textureError]); // Added dependencies

	// Render the cloned scene using primitive
	return useMemo(() => {
		if (!clonedScene) {
			// Return fallback or null if scene isn't ready
			console.log("Cloned scene not ready, rendering fallback (or null).");
			return isUpper ? (
				<FallbackUpperClothing
					textureUrl={safeTextureUrl}
					position={position}
				/>
			) : (
				<FallbackLowerClothing
					textureUrl={safeTextureUrl}
					position={position}
				/>
			);
		}
		// console.log("Rendering primitive with cloned scene");
		return <primitive object={clonedScene} dispose={null} />;
	}, [clonedScene, isUpper, safeTextureUrl, position]); // Added dependencies
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
				// Defensive check before removing listeners
				if (controls && typeof controls.removeEventListener === "function") {
					try {
						controls.removeEventListener("start", handleStart);
						controls.removeEventListener("end", handleEnd);
					} catch (error) {
						console.warn("Error removing OrbitControls listeners:", error);
					}
				}
			};
		}
	}, [setAutoRotate]); // controlsRef is stable, setAutoRotate is the dependency

	// Add checks for data validity before rendering ClothingModel
	if (
		!upperData ||
		!lowerData ||
		!upperData.textureUrl ||
		!lowerData.textureUrl
	) {
		console.warn(
			"SceneContent: upperData or lowerData missing or invalid. Rendering loader.",
			{ upperData, lowerData }
		);
		// Optionally return a loader or null instead of trying to render incomplete models
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
				shadow-mapSize-width={2048} // Increased shadow map size
				shadow-mapSize-height={2048}
				shadow-camera-far={50}
				shadow-camera-left={-10}
				shadow-camera-right={10}
				shadow-camera-top={10}
				shadow-camera-bottom={-10}
				shadow-bias={-0.0005} // Adjusted shadow bias
			/>
			<directionalLight position={[-5, 2, -2]} intensity={0.3} />
			{/* Environment */}
			<Environment preset="city" />
			{/* Ground Plane */}
			<mesh
				receiveShadow
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -1.5, 0]}>
				{" "}
				{/* Adjusted ground plane position */}
				<planeGeometry args={[20, 20]} />
				<meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} />
			</mesh>
			{/* Models Group */}
			<group ref={groupRef}>
				<ClothingModel
					// Use unique keys combining relevant changing props
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
					// Use unique keys combining relevant changing props
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
				target={[0, 0, 0]} // Centered target
				minDistance={2}
				maxDistance={10}
				// enableDamping={true} // Optional: Smoother controls
				// dampingFactor={0.05}
			/>
		</>
	);
}

// --- Main Component ---
export default function ClothingViewer() {
	const [upperIndex, setUpperIndex] = useState(0);
	const [lowerIndex, setLowerIndex] = useState(0);
	const [canvasKey, setCanvasKey] = useState(Date.now());
	const [isAutoRotating, setAutoRotate] = useState(true);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	// --- State for dynamic texture URL ---
	const [dynamicUpperTextureUrl, setDynamicUpperTextureUrl] = useState(null); // Start as null
	const [dynamicLowerTextureUrl, setDynamicLowerTextureUrl] = useState(null); // New state for lower clothing

	const { data, isLoading, error } = useQuery({
		queryKey: ["clothesAll"],
		queryFn : fetchOutfits
	});

	console.log(data)

	const { uppers, lowers } = useMemo(() => {
	const list = Array.isArray(data) ? data : [];
	return {
		uppers : list.filter(c => c.upper),
		lowers : list.filter(c => c.lower)
	};
	}, [data]);

	/** Convert one DB row → the shape ClothingModel expects */
	const rowToOption = (row, isUpper) => {
	// fix double “/thumbnails/thumbnails/” if it’s in S3 key
	const img = (row.signedImageUrl || row.imageUrl || "")
					.replace("/thumbnails/thumbnails/", "/thumbnails/");

	return {
		name:       row.name,
		textureUrl: img,                               // show correct picture
		geometryUrl:isUpper ? "/models/bomber_jacket.glb"
							: "/models/leg.glb",        // whatever model you want
		scale:      [1,1,1],
		position:   isUpper ? [0,-0.3,0] : [0,-0.6,0],
	};
	};


	// --- Effect to load URL from sessionStorage ---
	useEffect(() => {
		const UrlFromStorage = sessionStorage.getItem("selectedTextureUrl");
		const isUpper = sessionStorage.getItem("selectedModelisUpper") === "true";

		// const lowerUrlFromStorage = sessionStorage.getItem(
		// 	"selectedLowerTextureUrl"
		// );
		// console.log("Loaded from sessionStorage - Upper:", UrlFromStorage);
		// console.log("Loaded from sessionStorage - Lower:", UrlFromStorage);
		// *** IMPORTANT: Add a placeholder image at /public/textures/placeholder.png ***
		// *** OR change the fallback logic here
		//         ***
		// console.log("Is Upper:", isUpper);
		if (isUpper) {
			setDynamicUpperTextureUrl(UrlFromStorage || "/textures/red.png");
			setDynamicLowerTextureUrl("/textures/jeans.png"); // Default lower clothing
		} else {
			setDynamicUpperTextureUrl("/textures/red.png");
			setDynamicLowerTextureUrl(UrlFromStorage || "/textures/red.png");
		}
		// setDynamicUpperTextureUrl(UrlFromStorage || "/textures/placeholder.png");
		// setDynamicLowerTextureUrl(UrlFromStorage || "/textures/red.png");
	}, []); // Empty array runs once on mount

	// --- Define clothing options dynamically using useMemo ---

	const getUniqueByName = (items) => {
		const seen = new Set();
		return items.filter(item => {
			if (seen.has(item.name)) return false;
			seen.add(item.name);
			return true;
		});
	};
	const fetchTextureUrl = async (textureName) => {
		try {
			const response = await fetch(`http://localhost:8000/api/textures/${textureName}`);
			if (!response.ok) throw new Error("Texture not found");
			const data = await response.json();
			return data.signedUrl;
		} catch (err) {
			console.error(`Error fetching texture for ${textureName}:`, err);
			return "/textures/placeholder.png";  // Fallback texture
		}
	};

	const [upperTextures, setUpperTextures] = useState({});
	const [lowerTextures, setLowerTextures] = useState({});

	useEffect(() => {
		if (!Array.isArray(data)) return;
	
		const fetchAllTextures = async (items, setTextures, label) => {
			const texturesMap = {};
			await Promise.all(items.map(async (item) => {
				const textureName = `${item.name}_texture`;
				const url = await fetchTextureUrl(textureName);
				texturesMap[item.name] = url;
			}));
			console.log(`Fetched Textures for ${label}:`, texturesMap);
			setTextures(texturesMap);
		};
	
		const uniqueUppers = getUniqueByName(data.filter(item => item.upper));
		const uniqueLowers = getUniqueByName(data.filter(item => item.lower));
	
		fetchAllTextures(uniqueUppers, setUpperTextures, "Uppers");
		fetchAllTextures(uniqueLowers, setLowerTextures, "Lowers");
	
	}, [data]);
	

	const upperClothingOptions = useMemo(() => {
		if (!Array.isArray(data)) return [];
	
		const upperItems = getUniqueByName(data.filter(item => item.upper));
	
		return upperItems
			.filter(item => upperTextures[item.name])  
			.map(item => ({
				name: item.name,
				textureUrl: upperTextures[item.name],
				geometryUrl: "/models/bomber_jacket.glb",
				scale: [1, 1, 1],
				position: [0, -0.3, 0],
				price: item.price || 0,
				imageUrl: item.imageUrl || "",
			}));
	}, [data, upperTextures]);
	
	
	const LOWER_CLOTHING = useMemo(() => {
		if (!Array.isArray(data)) return [];
	
		const lowerItems = getUniqueByName(data.filter(item => item.lower));
	
		return lowerItems
			.filter(item => lowerTextures[item.name])  
			.map(item => ({
				name: item.name,
				textureUrl: lowerTextures[item.name],
				geometryUrl: "/models/leg.glb",
				scale: [1, 1, 1],
				position: [0, -0.6, 0],
				price: item.price || 0, 
				imageUrl: item.imageUrl || "", 
			}));
	}, [data, lowerTextures]);


	
	
	
	

	// Reset upperIndex if it becomes invalid when options change
	useEffect(() => {
		if (upperIndex >= upperClothingOptions.length) {
			setUpperIndex(0);
		}
	}, [upperClothingOptions, upperIndex]);

	// --- WebGL Context Lost Handler ---
	const handleContextLost = useCallback((e) => {
		console.warn("WebGL context lost. Attempting to restore...");
		e.preventDefault();
		setAutoRotate(false);
		setCanvasKey(Date.now()); // Force Canvas remount
		setSnackbarMessage("WebGL context lost. Attempting to reload viewer.");
		setSnackbarSeverity("warning");
		setShowSnackbar(true);
	}, []);

	// --- Auto-rotation Effect ---
	useEffect(() => {
		if (snackbarSeverity !== "warning") {
			setAutoRotate(true);
		}
	}, [upperIndex, lowerIndex, snackbarSeverity]);

	// --- Navigation Handlers (Using dynamic upperClothingOptions length) ---
	const handleUpperNext = () =>
		setUpperIndex((prev) => (prev + 1) % upperClothingOptions.length); // Use dynamic length
	const handleUpperPrev = () =>
		setUpperIndex(
			(prev) =>
				(prev - 1 + upperClothingOptions.length) % upperClothingOptions.length // Use dynamic length
		);
	const handleLowerNext = () =>
		setLowerIndex((prev) => (prev + 1) % LOWER_CLOTHING.length);
	const handleLowerPrev = () =>
		setLowerIndex(
			(prev) => (prev - 1 + LOWER_CLOTHING.length) % LOWER_CLOTHING.length
		);

	// --- Action Handlers (Using dynamic upperClothingOptions) ---
	const showNotification = (message, severity = "success") => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setShowSnackbar(true);
	};

	// --- Get current data safely ---
	// Ensure indices are valid before accessing data
	const safeUpperIndex = upperIndex % upperClothingOptions.length;
	const safeLowerIndex = lowerIndex % LOWER_CLOTHING.length;

	const currentUpperData = upperClothingOptions[safeUpperIndex];
	const currentLowerData = LOWER_CLOTHING[safeLowerIndex];

	// --- Loading State Check ---
	// Show loader if dynamic data isn't ready yet
	if (
		!currentUpperData ||
		!currentLowerData ||
		dynamicUpperTextureUrl === null ||
		dynamicLowerTextureUrl === null
	) {
		console.log("Main component loading state active...");
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

	const handleAddToFavorites = () => {
		// Log the currently selected data
		console.log("Added to favorites:", {
			upper: currentUpperData,
			lower: currentLowerData,
		});
		showNotification("Added to favorites!");
	};

	const handleResetLook = () => {
		setUpperIndex(0);
		setLowerIndex(0);
		setAutoRotate(true); // Re-enable auto-rotate on reset
		showNotification("Look reset to default", "info");
	};

	const handleAddToCart = () => {
		const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
	
		const itemsToAdd = [
			{
				productId: currentUpperData.name,   // Assuming `name` uniquely identifies
				name: currentUpperData.name,
				category: "Upper",
				price: currentUpperData.price || 0,  // Set price if available
				imageUrl: currentUpperData.imageUrl,
				quantity: 1,
			},
			{
				productId: currentLowerData.name,
				name: currentLowerData.name,
				category: "Lower",
				price: currentLowerData.price || 0, // Set price if available
				imageUrl: currentLowerData.imageUrl,
				quantity: 1,
			},
		];
	
		const updatedCart = [...cart];
	
		itemsToAdd.forEach(item => {
			const exists = updatedCart.some(ci => ci.productId === item.productId);
			if (!exists) updatedCart.push(item);
		});
	
		sessionStorage.setItem("cart", JSON.stringify(updatedCart));
	
		console.log("Added to cart:", itemsToAdd);
		showNotification("Current outfit added to cart!");
	};
	

	const handleSaveOutfit = () => {
		// Log the currently selected data
		console.log("Saved outfit:", {
			upper: currentUpperData,
			lower: currentLowerData,
		});
		showNotification("Outfit saved!");
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setShowSnackbar(false);
	};

	// --- Render UI ---
	console.log("Upper Options Length:", upperClothingOptions.length);
	console.log("Current Upper Index:", upperIndex);
	console.log("Current Upper Name:", currentUpperData?.name);

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
			</Box>

			{/* Main Content Area */}
			<Box
				sx={{
					flexGrow: 1,
					position: "relative",
					display: "flex",
					overflow: "hidden", // Important for containing the canvas/actions
				}}>
				{/* 3D Canvas Area */}
				<Box
					sx={{
						flexGrow: 1,
						position: "relative", // Needed for Suspense fallback positioning
						minHeight: "300px", // Ensure canvas has a minimum height
					}}>
					{/* Ensure data is valid before rendering Canvas */}
					{currentUpperData && currentLowerData && (
						<Suspense fallback={<CanvasLoader />}>
							<Canvas
								key={canvasKey}
								shadows
								camera={{ position: [0, 0.5, 4], fov: 50 }} // Adjusted camera slightly
								gl={{ preserveDrawingBuffer: true, antialias: true }}
								onCreated={({ gl, scene }) => {
									gl.domElement.addEventListener(
										"webglcontextlost",
										handleContextLost,
										false
									);
									// Optional: Set background color directly if gradient isn't needed
									// scene.background = new THREE.Color('#f0f0f0');
								}}
								style={{
									background: "linear-gradient(to bottom, #eef2f7, #ffffff)", // Gradient background
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
						width: { md: "90px" }, // Fixed width on medium+ screens
						display: { xs: "none", md: "flex" }, // Hidden on xs, flex on md+
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 4, // Spacing between buttons
						p: 2,
						borderLeft: "1px solid #eaeaea",
						backgroundColor: "#fff", // Match surrounding UI
						flexShrink: 0, // Prevent shrinking
					}}>
					{[
						{
							icon: <FavoriteIcon />,
							label: "Favorites",
							handler: handleAddToFavorites,
						},
						{ icon: <RefreshIcon />, label: "Reset", handler: handleResetLook },
						{
							icon: <ShoppingCartIcon />,
							label: "Add Cart",
							handler: handleAddToCart,
						},
						{
							icon: <SaveIcon />,
							label: "Save Look",
							handler: handleSaveOutfit,
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
									backgroundColor: "#f9f9f9", // Lighter background
									"&:hover": { backgroundColor: "#f0f0f0" }, // Hover effect
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
					flexWrap: "wrap", // Allow wrapping on smaller screens
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
						minWidth: { xs: "150px", sm: "220px" }, // Responsive minimum width
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
							whiteSpace: "nowrap", // Prevent text wrapping
							fontSize: { xs: "0.8rem", md: "0.875rem" },
						}}>
						{/* Display name from currentUpperData */}
						{currentUpperData.name}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
						{" "}
						{/* Push buttons to the right */}
						<IconButton
							onClick={handleUpperPrev}
							size="small"
							sx={{ mr: 0.5 }}
							aria-label="Previous Shirt">
							<ArrowBack fontSize="small" />
						</IconButton>
						<IconButton
							onClick={handleUpperNext}
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
						minWidth: { xs: "150px", sm: "220px" }, // Responsive minimum width
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
							whiteSpace: "nowrap", // Prevent text wrapping
							fontSize: { xs: "0.8rem", md: "0.875rem" },
						}}>
						{/* Display name from currentLowerData */}
						{currentLowerData.name}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
						{" "}
						{/* Push buttons to the right */}
						<IconButton
							onClick={handleLowerPrev}
							size="small"
							sx={{ mr: 0.5 }}
							aria-label="Previous Pants">
							<ArrowBack fontSize="small" />
						</IconButton>
						<IconButton
							onClick={handleLowerNext}
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
					display: { xs: "flex", md: "none" }, // Display only on xs screens
					justifyContent: "space-around", // Distribute buttons evenly
					p: 1.5,
					gap: 1,
					borderTop: "1px solid #eaeaea",
					backgroundColor: "#fff",
				}}>
				<Button
					variant="contained"
					startIcon={<FavoriteIcon />}
					onClick={handleAddToFavorites}
					size="small"
					sx={{
						flex: 1,
						py: 1,
						backgroundColor: "#4a90e2",
						"&:hover": { backgroundColor: "#3a80d2" },
						fontSize: "0.75rem",
					}}>
					Favorite
				</Button>
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
				<Button
					variant="outlined"
					startIcon={<SaveIcon />}
					onClick={handleSaveOutfit}
					size="small"
					sx={{
						flex: 1,
						py: 1,
						borderColor: "#ccc",
						color: "#555",
						fontSize: "0.75rem",
					}}>
					Save
				</Button>
			</Box>

			{/* Notification Snackbar */}
			<Snackbar
				open={showSnackbar}
				autoHideDuration={3000} // Duration message is shown
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				{/* Wrap Alert for onClose propagation */}
				<Alert
					onClose={handleCloseSnackbar} // Allows closing via the 'x' on the Alert
					severity={snackbarSeverity}
					variant="filled" // Filled variant looks good for notifications
					sx={{ width: "100%" }} // Ensure Alert fills Snackbar width
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
}

import React, {
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

const UPPER_CLOTHING = [
	{
		name: "Blue Pattern Shirt",
		textureUrl: "/textures/red.png",
		geometryUrl: "/models/bomber_jacket.glb",
		scale: [1, 1, 1],
		position: [0, -0.3, 0],
	},
	{
		name: "Red Stripe Shirt",
		textureUrl: "/textures/texture.png",
		geometryUrl: "/models/bomber_jacket.glb",
		scale: [1, 1, 1],
		position: [0, -0.3, 0],
	},
];

const LOWER_CLOTHING = [
	{
		name: "Denim Jeans",
		textureUrl: "/textures/jeans.png",
		geometryUrl: "/models/leg.glb",
		scale: [1, 1, 1],
		position: [0, -0.6, 0],
	},
	{
		name: "Khaki Pants",
		textureUrl: "/textures/red.png", // Make sure this exists
		geometryUrl: "/models/leg.glb", // Make sure this exists
		scale: [1, 1, 1],
		position: [0, -0.6, 0],
	},
];

// --- Components ---

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

// Fallback using simple shapes if GLB fails
function FallbackUpperClothing({ textureUrl, position }) {
	const [fbTextureError, setFbTextureError] = useState(false);
	const texture = useTexture(
		textureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			console.warn("Fallback texture failed to load:", error);
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
	const texture = useTexture(
		textureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			console.warn("Fallback texture failed to load:", error);
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

// Main model loading component with error handling and fallback
function ClothingModel({ geometryUrl, textureUrl, scale, position, isUpper }) {
	const [modelError, setModelError] = useState(false);
	const [textureError, setTextureError] = useState(false);

	// Reset errors when URLs change
	useEffect(() => {
		setModelError(false);
		setTextureError(false);
	}, [geometryUrl, textureUrl]);

	const { scene: geometryScene } = useGLTF(
		geometryUrl,
		undefined, // Optional progress callback
		(error) => {
			console.error(`Failed to load model: ${geometryUrl}`, error);
			setModelError(true); // Trigger fallback on GLTF load error
		}
	);

	const texture = useTexture(
		textureUrl,
		(tex) => {
			tex.flipY = false;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.needsUpdate = true;
		},
		(error) => {
			console.error(`Failed to load texture: ${textureUrl}`, error);
			setTextureError(true); // Track texture load error
		}
	);

	// If the primary model failed, render the fallback immediately
	if (modelError) {
		console.log(
			`Rendering fallback for ${isUpper ? "upper" : "lower"} clothing.`
		);
		return isUpper ? (
			<FallbackUpperClothing textureUrl={textureUrl} position={position} />
		) : (
			<FallbackLowerClothing textureUrl={textureUrl} position={position} />
		);
	}

	// Memoize scene cloning and material application
	const clonedScene = useMemo(() => {
		// Don't proceed if the geometry hasn't loaded yet (useGLTF is async)
		if (!geometryScene) return null;

		const clone = geometryScene.clone();
		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;

				const applyTexture = (material) => {
					// Only apply texture if it loaded successfully
					if (!textureError && material.map !== undefined) {
						material.map = texture;
						// Handle potential transparency if using PNGs with alpha
						if (
							texture.format === THREE.RGBAFormat ||
							textureUrl.endsWith(".png")
						) {
							material.transparent = true;
							// material.alphaTest = 0.5; // Adjust if needed
						}
						// Ensure material updates
						material.needsUpdate = true;
					} else if (textureError) {
						// Optional: Set a fallback color if texture fails but model loads
						// material.color?.set('#aaaaaa');
						// material.map = null; // Ensure no old texture is lingering
						// material.needsUpdate = true;
					}
				};

				if (Array.isArray(child.material)) {
					child.material.forEach(applyTexture);
				} else if (child.material) {
					applyTexture(child.material);
				}
			}
		});
		clone.scale.set(...scale);
		clone.position.set(...position);
		return clone;
		// Dependencies: If any of these change, recalculate the cloned scene
	}, [geometryScene, texture, scale, position, textureUrl, textureError]);

	// Render the primitive only if clonedScene is ready
	// Using useMemo here is likely a micro-optimization, could return directly
	return useMemo(() => {
		if (!clonedScene) return null; // Don't render anything if clone isn't ready
		// dispose={null} is important when dynamically changing textures/models managed by hooks
		return <primitive object={clonedScene} dispose={null} />;
	}, [clonedScene]);
}

function SceneContent({ upperData, lowerData, setAutoRotate, isAutoRotating }) {
	const groupRef = useRef();
	const controlsRef = useRef();
	const ROTATION_SPEED = 0.1; // Rotation speed

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
				// Cleanup listeners
				if (controls?.removeEventListener) {
					try {
						controls.removeEventListener("start", handleStart);
						controls.removeEventListener("end", handleEnd);
					} catch (error) {
						console.warn("Error removing OrbitControls listeners:", error);
					}
				}
			};
		}
	}, [setAutoRotate]); // Re-run only if setAutoRotate changes identity

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
					// Using a combination key for updates
					key={`upper-${upperData.geometryUrl}-${upperData.textureUrl}`}
					geometryUrl={upperData.geometryUrl}
					textureUrl={upperData.textureUrl}
					scale={upperData.scale}
					position={upperData.position}
					isUpper={true}
				/>
				<ClothingModel
					key={`lower-${lowerData.geometryUrl}-${lowerData.textureUrl}`}
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

// Main Component
export default function ClothingViewer() {
	const [upperIndex, setUpperIndex] = useState(0);
	const [lowerIndex, setLowerIndex] = useState(0);
	const [canvasKey, setCanvasKey] = useState(Date.now());
	const [isAutoRotating, setAutoRotate] = useState(true);
	const [snackbarMessage, setSnackbarMessage] = useState(""); // Renamed from errorMessage
	const [showSnackbar, setShowSnackbar] = useState(false); // Renamed from showError
	const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // For different message types

	const handleContextLost = useCallback((e) => {
		console.warn("WebGL context lost. Attempting to restore...");
		e.preventDefault();
		setAutoRotate(false);
		setCanvasKey(Date.now());
		setSnackbarMessage("WebGL context lost. Attempting to reload viewer.");
		setSnackbarSeverity("warning");
		setShowSnackbar(true);
	}, []);

	// Resume auto-rotate when clothes change
	useEffect(() => {
		setAutoRotate(true);
	}, [upperIndex, lowerIndex]);

	const handleUpperNext = () =>
		setUpperIndex((prev) => (prev + 1) % UPPER_CLOTHING.length);
	const handleUpperPrev = () =>
		setUpperIndex(
			(prev) => (prev - 1 + UPPER_CLOTHING.length) % UPPER_CLOTHING.length
		);
	const handleLowerNext = () =>
		setLowerIndex((prev) => (prev + 1) % LOWER_CLOTHING.length);
	const handleLowerPrev = () =>
		setLowerIndex(
			(prev) => (prev - 1 + LOWER_CLOTHING.length) % LOWER_CLOTHING.length
		);

	// --- Action Handlers ---
	const showNotification = (message, severity = "success") => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setShowSnackbar(true);
	};

	const handleAddToFavorites = () => {
		console.log("Added to favorites:", {
			upper: UPPER_CLOTHING[upperIndex],
			lower: LOWER_CLOTHING[lowerIndex],
		});
		showNotification("Added to favorites!");
	};

	const handleResetLook = () => {
		setUpperIndex(0);
		setLowerIndex(0);
		showNotification("Look reset to default", "info");
	};

	const handleAddToCart = () => {
		console.log("Added to cart:", {
			upper: UPPER_CLOTHING[upperIndex],
			lower: LOWER_CLOTHING[lowerIndex],
		});
		showNotification("Added to cart!");
	};

	const handleSaveOutfit = () => {
		console.log("Saved outfit:", {
			upper: UPPER_CLOTHING[upperIndex],
			lower: LOWER_CLOTHING[lowerIndex],
		});
		showNotification("Outfit saved!");
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setShowSnackbar(false);
	};

	const currentUpperData = UPPER_CLOTHING[upperIndex];
	const currentLowerData = LOWER_CLOTHING[lowerIndex];

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: "#f5f5f7" /* Slightly off-white bg */,
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
					overflow: "hidden" /* Prevent layout shifts */,
				}}>
				{/* 3D Canvas Area */}
				<Box
					sx={{
						flexGrow: 1,
						position: "relative",
						minHeight: "300px" /* Ensure canvas has space */,
					}}>
					<Suspense fallback={<CanvasLoader />}>
						<Canvas
							key={canvasKey}
							shadows
							camera={{ position: [0, 0.5, 4], fov: 50 }}
							gl={{ preserveDrawingBuffer: true, antialias: true }} // Enable antialiasing
							onCreated={({ gl }) => {
								gl.domElement.addEventListener(
									"webglcontextlost",
									handleContextLost,
									false
								);
								// Optional: Improve performance settings
								// gl.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);
							}}
							style={{
								background: "linear-gradient(to bottom, #eef2f7, #ffffff)",
							}} // Subtle gradient background
						>
							<SceneContent
								upperData={currentUpperData}
								lowerData={currentLowerData}
								isAutoRotating={isAutoRotating}
								setAutoRotate={setAutoRotate}
							/>
						</Canvas>
					</Suspense>
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
					display: { xs: "flex", md: "none" },
					justifyContent: "space-around",
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
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				{/* Wrap Alert for onClose propagation */}
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					variant="filled"
					sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
}

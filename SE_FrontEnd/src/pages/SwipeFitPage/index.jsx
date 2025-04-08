"use client"

import React, { useState, useRef, useEffect, Suspense } from "react";
import {
	Box,
	Typography,
	Grid,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	Environment,
	useGLTF,
	useTexture,
} from "@react-three/drei";
import * as THREE from "three"; // Needed for texture constants

// --- Data Configuration ---
// IMPORTANT: Replace placeholders with your actual file paths!
// Ensure the .glb files exist in /public/models and are UV Unwrapped.
// Ensure the .png/.jpg files exist in /public/textures.

const UPPER_CLOTHING = [
	{
		name: "Blue Pattern Shirt",
		textureUrl: "/textures/yellow.jpeg", // YOUR SHIRT TEXTURE IMAGE
		geometryUrl: "/models/bomber_jacket.glb", // YOUR GENERIC SHIRT .GLB MODEL
		scale: [1, 1, 1], // Adjust scale as needed
		position: [0, -0.3, 0], // Adjust position as needed
	},
	{
		name: "Red Stripe Shirt",
		textureUrl: "/textures/texture.png", // YOUR SHIRT TEXTURE IMAGE
		geometryUrl: "/models/bomber_jacket.glb", // YOUR GENERIC SHIRT .GLB MODEL
		scale: [1, 1, 1], // Adjust scale as needed
		position: [0, -0.3, 0], // Adjust position as needed
	},
	// Add more upper clothing items...
];

const LOWER_CLOTHING = [
	{
		name: "Denim Jeans",
		textureUrl: "/textures/jeans.png", // YOUR PANTS TEXTURE IMAGE
		geometryUrl: "/models/leg.glb", // YOUR GENERIC PANTS .GLB MODEL
		scale: [1, 1, 1], // Adjust scale as needed
		position: [0, -0.6, 0], // Adjust position as needed
	},
	{
		name: "Khaki Pants",
		textureUrl: "/textures/red.png", // YOUR PANTS TEXTURE IMAGE
		geometryUrl: "/models/leg.glb", // YOUR GENERIC PANTS .GLB MODEL
		scale: [1, 1, 1], // Adjust scale as needed
		position: [0, -0.6, 0], // Adjust position as needed
	},
	// Add more lower clothing items...
];

// --- Components ---

/**
 * Loader component displayed while assets are loading (HTML/MUI based).
 */
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

/**
 * Renders a 3D model geometry and applies a dynamic texture to it.
 * Assumes the geometry from geometryUrl is UV unwrapped.
 */
function ClothingModel({ geometryUrl, textureUrl, scale, position }) {
	const { scene: geometryScene } = useGLTF(geometryUrl); // Load geometry (cached)
	const texture = useTexture(textureUrl); // Load texture (cached)

	// Configure texture properties
	useEffect(() => {
		texture.flipY = false; // Standard for GLTF textures
		texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color
		texture.needsUpdate = true; // Ensure updates are applied
	}, [texture]);

	// Use useRef for the mesh to potentially access it later if needed
	const modelRef = useRef();

	// Memoize the cloned scene and texture application to avoid re-computation
	// unless necessary props change.
	const clonedScene = React.useMemo(() => {
		const clone = geometryScene.clone(); // Clone base geometry

		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				// Apply the new texture to the material's map
				// Important: This assumes a standard material setup (like MeshStandardMaterial)
				// where the 'map' property holds the main texture.
				if (Array.isArray(child.material)) {
					// Handle cases where a mesh might have multiple materials
					child.material.forEach((material) => {
						if (material.map !== undefined) {
							material.map = texture;
							// Set color to white to avoid tinting the texture, unless desired
							// material.color?.set(0xffffff);
							material.needsUpdate = true;
						}
					});
				} else if (child.material && child.material.map !== undefined) {
					child.material.map = texture;
					// child.material.color?.set(0xffffff); // Optional: remove base color tint
					child.material.needsUpdate = true;
				}
				// Handle potential transparency if using PNGs with alpha
				if (
					texture.format === THREE.RGBAFormat ||
					textureUrl.endsWith(".png")
				) {
					if (Array.isArray(child.material)) {
						child.material.forEach((material) => {
							material.transparent = true;
							// material.alphaTest = 0.5; // Adjust if needed for sharp cutouts
							material.needsUpdate = true;
						});
					} else if (child.material) {
						child.material.transparent = true;
						// child.material.alphaTest = 0.5;
						child.material.needsUpdate = true;
					}
				}
			}
		});

		// Set scale and position on the cloned root
		clone.scale.set(...scale);
		clone.position.set(...position);
		return clone;
	}, [geometryScene, texture, scale, position, textureUrl]); // Depend on relevant props

	return <primitive ref={modelRef} object={clonedScene} dispose={null} />;
	// dispose={null} prevents R3F from disposing the geometry/material when the component
	// unmounts, which is desired since the texture is applied dynamically and the base
	// geometry/material might be cached/reused by useGLTF.
}

/**
 * Main component holding the Canvas, controls, and state.
 */
export default function ClothingViewer() {
	const [upperIndex, setUpperIndex] = useState(0);
	const [lowerIndex, setLowerIndex] = useState(0);
	const [canvasKey, setCanvasKey] = useState(Date.now()); // For context loss recovery

	// Context loss handler
	const handleContextLost = React.useCallback((e) => {
		console.warn("WebGL context lost. Attempting to restore...");
		e.preventDefault();
		setCanvasKey(Date.now()); // Force canvas remount
	}, []);

	// Navigation handlers
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

	const currentUpperData = UPPER_CLOTHING[upperIndex];
	const currentLowerData = LOWER_CLOTHING[lowerIndex];

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: "#f0f0f0",
			}}>
			{/* Control UI */}
			<Box
				sx={{
					p: 2,
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					zIndex: 10,
					boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
				}}>
				<Grid container spacing={1} justifyContent="center" alignItems="center">
					{/* Upper Clothing Controls */}
					<Grid
						item
						xs={12}
						sm={5}
						container
						alignItems="center"
						justifyContent="center">
						<IconButton onClick={handleUpperPrev} size="small">
							{" "}
							<ArrowBack />{" "}
						</IconButton>
						<Typography
							variant="body2"
							sx={{
								mx: 1,
								textAlign: "center",
								minWidth: "120px",
								fontWeight: 500,
							}}>
							{currentUpperData.name}
						</Typography>
						<IconButton onClick={handleUpperNext} size="small">
							{" "}
							<ArrowForward />{" "}
						</IconButton>
					</Grid>
					{/* Divider */}
					<Grid
						item
						xs={12}
						sm={1}
						sx={{
							display: { xs: "block", sm: "block" },
							textAlign: "center",
							color: "grey.400",
							fontWeight: 300,
							my: { xs: 1, sm: 0 },
						}}>
						|
					</Grid>
					{/* Lower Clothing Controls */}
					<Grid
						item
						xs={12}
						sm={5}
						container
						alignItems="center"
						justifyContent="center">
						<IconButton onClick={handleLowerPrev} size="small">
							{" "}
							<ArrowBack />{" "}
						</IconButton>
						<Typography
							variant="body2"
							sx={{
								mx: 1,
								textAlign: "center",
								minWidth: "120px",
								fontWeight: 500,
							}}>
							{currentLowerData.name}
						</Typography>
						<IconButton onClick={handleLowerNext} size="small">
							{" "}
							<ArrowForward />{" "}
						</IconButton>
					</Grid>
				</Grid>
			</Box>

			{/* 3D Canvas Area */}
			<Box sx={{ flexGrow: 1, position: "relative" }}>
				{/* Suspense wraps Canvas for asset loading fallback */}
				<Suspense fallback={<CanvasLoader />}>
					<Canvas
						key={canvasKey} // Force remount on context loss
						shadows // Enable shadows
						camera={{ position: [0, 0.5, 4], fov: 50 }} // Adjust camera as needed
						gl={{ preserveDrawingBuffer: true }} // Optional: If you need to screenshot
						onCreated={({ gl }) => {
							gl.domElement.addEventListener(
								"webglcontextlost",
								handleContextLost,
								false
							);
							// Optional: Set background color if needed (though Box bgcolor works)
							// gl.setClearColor('#f0f0f0');
						}}>
						{/* Lighting */}
						<ambientLight intensity={0.7} />
						<directionalLight
							position={[5, 8, 5]} // Adjust light position
							intensity={1.5} // Adjust intensity
							castShadow
							shadow-mapSize-width={2048} // Increase shadow map resolution
							shadow-mapSize-height={2048}
							shadow-camera-far={50}
							shadow-camera-left={-10}
							shadow-camera-right={10}
							shadow-camera-top={10}
							shadow-camera-bottom={-10}
							shadow-bias={-0.0005} // Fine-tune shadow bias if needed
						/>
						{/* Optional: Add subtle fill light */}
						<directionalLight position={[-5, 2, -2]} intensity={0.3} />

						{/* Environment for reflections and ambient light */}
						<Environment preset="city" />

						{/* Ground Plane for Shadows */}
						<mesh
							receiveShadow
							rotation={[-Math.PI / 2, 0, 0]}
							position={[0, -1.5, 0]}>
							<planeGeometry args={[20, 20]} />
							{/* Use MeshStandardMaterial for more realistic ground, or shadowMaterial for invisible */}
							<meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} />
							{/* <shadowMaterial opacity={0.3} /> */}
						</mesh>

						{/* Clothing Models - Keys ensure remount on change */}
						<group>
							<ClothingModel
								key={`upper-${upperIndex}-${currentUpperData.textureUrl}`}
								geometryUrl={currentUpperData.geometryUrl}
								textureUrl={currentUpperData.textureUrl}
								scale={currentUpperData.scale}
								position={currentUpperData.position}
							/>
							<ClothingModel
								key={`lower-${lowerIndex}-${currentLowerData.textureUrl}`}
								geometryUrl={currentLowerData.geometryUrl}
								textureUrl={currentLowerData.textureUrl}
								scale={currentLowerData.scale}
								position={currentLowerData.position}
							/>
						</group>

						{/* Camera Controls */}
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							target={[0, 0, 0]} // Target the center of the outfit
							minDistance={2} // Prevent zooming too close
							maxDistance={10} // Prevent zooming too far
						/>
					</Canvas>
				</Suspense>
			</Box>
		</Box>
	);
}

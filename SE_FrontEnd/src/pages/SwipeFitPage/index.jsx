"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import {
	Box,
	Typography,
	Grid,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Canvas } from "@react-three/fiber"; // No need for useLoader/useThree here if not used directly
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
// Removed THREE import if not directly used here
// Removed GLTFLoader import if only using useGLTF

// Define clothing items (assuming UPPER_CLOTHING, LOWER_CLOTHING are defined as before)
const UPPER_CLOTHING = [
	{
		name: "Fleece Jacket",
		url: "/models/fleece_jacket.glb", // Replace with your actual path
		scale: [2, 2, 2],
		position: [0, 0.4, 0],
	},
	{
		name: "T-Shirt", // Example
		url: "/models/tshirt.glb", // Replace with your actual path
		scale: [2, 2, 2],
		position: [0, 0.4, 0],
	},
];

const LOWER_CLOTHING = [
	{
		name: "Jeans",
		url: "/models/jeans.glb", // Replace with your actual path
		scale: [2.2, 2.2, 2.2],
		position: [0, -1, 0],
	},
	{
		name: "Shorts", // Example
		url: "/models/shorts.glb", // Replace with your actual path
		scale: [2, 2, 2],
		position: [0, -0.5, 0],
	},
];

// Simple component to display while canvas/models are loading via Suspense
// This renders standard HTML/MUI elements and is used OUTSIDE the Canvas
function CanvasLoader() {
	return (
		<Box
			sx={{
				// Make loader cover the area Canvas would occupy
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column", // Stack items vertically
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "rgba(240, 240, 240, 0.9)", // Use background color
				zIndex: 20,
			}}>
			<CircularProgress />
			<Typography variant="body1" sx={{ mt: 2 }}>
				{" "}
				{/* Margin Top */}
				Loading 3D Models...
			</Typography>
		</Box>
	);
}

// Helper component to load and display a single clothing item using useGLTF
// This component WILL suspend, triggering the nearest Suspense boundary
function ClothingModel({ url, scale, position }) {
	const { scene } = useGLTF(url); // useGLTF triggers Suspense
	const modelRef = useRef();

	// Clone scene for manipulation
	const clonedScene = scene.clone();
	clonedScene.scale.set(...scale);
	clonedScene.position.set(...position);

	// Set shadows
	useEffect(() => {
		clonedScene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	}, [clonedScene]); // Rerun if scene instance changes (though clone should be stable)

	// Primitive is used to inject the existing Object3D (clonedScene) into R3F
	return <primitive ref={modelRef} object={clonedScene} />;
}

export default function ClothingViewer() {
	const [upperIndex, setUpperIndex] = useState(0);
	const [lowerIndex, setLowerIndex] = useState(0);
	// Removed loading state as Suspense handles it
	const [canvasKey, setCanvasKey] = useState(Date.now());

	const handleContextLost = (e) => {
		console.warn("WebGL context lost. Attempting to restore...");
		e.preventDefault();
		setTimeout(() => setCanvasKey(Date.now()), 100);
	};

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

	const currentUpper = UPPER_CLOTHING[upperIndex];
	const currentLower = LOWER_CLOTHING[lowerIndex];

	return (
		<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			{/* Control UI */}
			<Box
				sx={{ p: 2, backgroundColor: "rgba(255, 255, 255, 0.8)", zIndex: 10 }}>
				<Grid container spacing={2} justifyContent="center" alignItems="center">
					{/* Upper Clothing Controls */}
					<Grid
						item
						xs={12}
						sm={5}
						container
						alignItems="center"
						justifyContent="center">
						<IconButton onClick={handleUpperPrev}>
							{" "}
							<ArrowBack />{" "}
						</IconButton>
						<Typography
							variant="body1"
							sx={{ mx: 1, textAlign: "center", minWidth: "100px" }}>
							{currentUpper.name}
						</Typography>
						<IconButton onClick={handleUpperNext}>
							{" "}
							<ArrowForward />{" "}
						</IconButton>
					</Grid>
					<Grid
						item
						xs={12}
						sm={1}
						sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>
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
						<IconButton onClick={handleLowerPrev}>
							{" "}
							<ArrowBack />{" "}
						</IconButton>
						<Typography
							variant="body1"
							sx={{ mx: 1, textAlign: "center", minWidth: "100px" }}>
							{currentLower.name}
						</Typography>
						<IconButton onClick={handleLowerNext}>
							{" "}
							<ArrowForward />{" "}
						</IconButton>
					</Grid>
				</Grid>
			</Box>

			{/* 3D Canvas Area - Relative position needed for absolute positioned loader */}
			<Box
				sx={{ flexGrow: 1, position: "relative", backgroundColor: "#f0f0f0" }}>
				{/* Suspense now wraps the Canvas */}
				<Suspense fallback={<CanvasLoader />}>
					<Canvas
						key={canvasKey}
						shadows
						camera={{ position: [0, 0.5, 4], fov: 50 }}
						onCreated={({ gl }) => {
							gl.domElement.addEventListener(
								"webglcontextlost",
								handleContextLost,
								false
							);
							// Optional: Set clear color if background box isn't sufficient
							// gl.setClearColor('#f0f0f0');
						}}>
						{/* Scene contents are direct children now */}
						<ambientLight intensity={0.6} />
						<directionalLight
							position={[5, 5, 5]}
							intensity={1.0}
							castShadow
							shadow-mapSize-width={1024}
							shadow-mapSize-height={1024}
							shadow-camera-far={50}
							shadow-camera-left={-10}
							shadow-camera-right={10}
							shadow-camera-top={10}
							shadow-camera-bottom={-10}
						/>
						<directionalLight position={[-5, 3, -2]} intensity={0.5} />
						<Environment preset="city" />

						<group>
							{/* Use unique keys to ensure component remounts on item change */}
							<ClothingModel
								key={`upper-${upperIndex}-${currentUpper.url}`}
								url={currentUpper.url}
								scale={currentUpper.scale}
								position={currentUpper.position}
							/>
							<ClothingModel
								key={`lower-${lowerIndex}-${currentLower.url}`}
								url={currentLower.url}
								scale={currentLower.scale}
								position={currentLower.position}
							/>
						</group>

						<mesh
							receiveShadow
							rotation={[-Math.PI / 2, 0, 0]}
							position={[0, -1.5, 0]}>
							<planeGeometry args={[10, 10]} />
							<shadowMaterial opacity={0.3} />
						</mesh>

						<OrbitControls
							enablePan={true}
							enableZoom={true}
							target={[0, 0, 0]}
						/>
					</Canvas>
				</Suspense>
			</Box>
		</Box>
	);
}

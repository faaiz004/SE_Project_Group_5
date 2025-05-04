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
		  backgroundColor: "rgba(240,240,240,0.9)",
		  zIndex: 20,
		}}
	  >
		<CircularProgress />
		<Typography variant="body1" sx={{ mt: 2 }}>
		  Loading 3D Models...
		</Typography>
	  </Box>
	);
  }
  
  function FallbackClothing({ textureUrl, position, type }) {
	const isUpper = type === "upper";
	const [error, setError] = useState(false);
	const safeUrl =
	  textureUrl || (isUpper ? "/textures/texture.png" : "/textures/red.png");
	const texture = useTexture(
	  safeUrl,
	  (tex) => {
		tex.flipY = false;
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.needsUpdate = true;
	  },
	  () => setError(true)
	);
	const matProps = useMemo(
	  () => ({
		map: error ? null : texture,
		roughness: 0.7,
		metalness: 0.1,
		color: error ? "#888888" : "#ffffff",
	  }),
	  [texture, error]
	);
  
	if (isUpper) {
	  return (
		<group position={position}>
		  <DreiBox args={[0.8, 0.5, 0.4]} position={[0, 0.25, 0]} castShadow receiveShadow>
			<meshStandardMaterial {...matProps} />
		  </DreiBox>
		  <Cylinder
			args={[0.1, 0.1, 0.6]}
			position={[-0.5, 0.1, 0]}
			rotation={[0, 0, Math.PI / 2]}
			castShadow
			receiveShadow
		  >
			<meshStandardMaterial {...matProps} />
		  </Cylinder>
		  <Cylinder
			args={[0.1, 0.1, 0.6]}
			position={[0.5, 0.1, 0]}
			rotation={[0, 0, Math.PI / 2]}
			castShadow
			receiveShadow
		  >
			<meshStandardMaterial {...matProps} />
		  </Cylinder>
		</group>
	  );
	}
  
	return (
	  <group position={position}>
		<Cylinder args={[0.15, 0.15, 1]} position={[-0.2, -0.5, 0]} castShadow receiveShadow>
		  <meshStandardMaterial {...matProps} />
		</Cylinder>
		<Cylinder args={[0.15, 0.15, 1]} position={[0.2, -0.5, 0]} castShadow receiveShadow>
		  <meshStandardMaterial {...matProps} />
		</Cylinder>
	  </group>
	);
  }
  
  /**
   * ClothingModel with retry‑on‑error for expired S3 URLs.
   */
  function ClothingModel({ geometryUrl, textureUrl, scale, position, isUpper, name }) {
	const [modelError, setModelError] = useState(false);
	const [texError, setTexError] = useState(false);
  
	// Keep a local, replaceable texture URL so we can swap a fresh presigned link on failure.
	const initialUrl = textureUrl || "/textures/green.png";
	const [currentUrl, setCurrentUrl] = useState(initialUrl);
  
	// Reset error flags when the geometry or base URL changes (e.g., on option switch).
	useEffect(() => {
	  setModelError(false);
	  setTexError(false);
	  setCurrentUrl(initialUrl);
	}, [geometryUrl, initialUrl]);
  
	/** Load geometry */
	const { scene, error: gltfError } = useGLTF(geometryUrl, true);
	useEffect(() => {
	  if (gltfError) setModelError(true);
	}, [gltfError]);
  
	/** Load texture with retry */
	const texture = useTexture(
	  currentUrl,
	  (tex) => {
		tex.flipY = false;
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.needsUpdate = true;
		setTexError(false);
	  },
	  async () => {
		// Texture failed (likely URL expired) → try fetching a fresh signed URL.
		try {
		  const res = await fetch(`/api/textures/${name}_texture`);
		  if (!res.ok) throw new Error("fetch failed");
		  const { signedUrl } = await res.json();
		  setCurrentUrl(signedUrl); // triggers re‑load automatically
		} catch (err) {
		  setTexError(true); // final fallback to grey material
		}
	  }
	);
  
	if (modelError) {
	  return (
		<FallbackClothing
		  textureUrl={currentUrl}
		  position={position}
		  type={isUpper ? "upper" : "lower"}
		/>
	  );
	}
  
	const cloned = useMemo(() => {
	  if (!scene) return null;
	  const clone = scene.clone();
	  clone.traverse((child) => {
		if (child.isMesh && child.material) {
		  const apply = (m) => {
			if (!texError && texture) {
			  m.map = texture;
			  m.transparent = texture.format === THREE.RGBAFormat || currentUrl.endsWith(".png");
			  m.alphaTest = m.transparent ? 0.1 : 0;
			} else if (texError) {
			  m.color.set("#888888");
			  m.map = null;
			}
			m.needsUpdate = true;
		  };
		  Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material);
		  child.castShadow = child.receiveShadow = true;
		}
	  });
	  clone.scale.set(...scale);
	  clone.position.set(...position);
	  return clone;
	}, [scene, texture, scale, position, currentUrl, texError]);
  
	return cloned ? (
	  <primitive object={cloned} dispose={null} />
	) : (
	  <FallbackClothing
		textureUrl={currentUrl}
		position={position}
		type={isUpper ? "upper" : "lower"}
	  />
	);
  }
  
  /**
   * SceneContent – unchanged except name prop now passed to ClothingModel.
   */
  function SceneContent({ upperData, lowerData, isAutoRotating, setAutoRotate }) {
	const groupRef = useRef();
	const controlsRef = useRef();
	const ROTATION_SPEED = 0.1;
  
	useFrame((_, delta) => {
	  if (isAutoRotating && groupRef.current) {
		groupRef.current.rotation.y += delta * ROTATION_SPEED;
	  }
	});
  
	useEffect(() => {
	  const ctrl = controlsRef.current;
	  if (!ctrl) return;
  
	  const onStart = () => setAutoRotate(false);
	  const onEnd = () => setAutoRotate(true);
  
	  ctrl.addEventListener("start", onStart);
	  ctrl.addEventListener("end", onEnd);
	  return () => {
		ctrl.removeEventListener("start", onStart);
		ctrl.removeEventListener("end", onEnd);
	  };
	}, [setAutoRotate]);
  
	if (!upperData?.textureUrl || !lowerData?.textureUrl) return <CanvasLoader />;
  
	return (
	  <>
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
		<Environment preset="city" />
		<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
		  <planeGeometry args={[20, 20]} />
		  <meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} />
		</mesh>
		<group ref={groupRef}>
		  <ClothingModel {...upperData} isUpper name={upperData.name} />
		  <ClothingModel {...lowerData} isUpper={false} name={lowerData.name} />
		</group>
		<OrbitControls
		  ref={controlsRef}
		  makeDefault
		  enablePan
		  enableZoom
		  target={[0, 0, 0]}
		  minDistance={2}
		  maxDistance={10}
		/>
	  </>
	);
  }
  
  export default function ClothingViewer() {
	const navigate = useNavigate();
  
	const [indices, setIndices] = useState({ upper: 0, lower: 0 });
	const [canvasKey, setCanvasKey] = useState(Date.now());
	const [isAutoRotating, setAutoRotate] = useState(true);
	const [snackbar, setSnackbar] = useState({ message: "", show: false, severity: "success" });
  
	const { data } = useQuery({
		queryKey: ["clothesAll"],
		queryFn: fetchOutfits,
		refetchOnMount: true,
		staleTime: 0,
		cacheTime: 0,
	});
	const [textureStore, setTextureStore] = useState({ upper: {}, lower: {} });
  
	const getUniqueByName = useCallback((items) => {
	  const seen = new Set();
	  return items?.filter((i) => i && !seen.has(i.name) && seen.add(i.name)) || [];
	}, []);
  
	const fetchTextureUrl = useCallback(async (name) => {
	  try {
		const res = await fetch(`https://se-project-group-5.onrender.com/api/textures/${name}`);
		if (!res.ok) throw new Error();
		const json = await res.json();
		return json.signedUrl;
	  } catch {
		return "/textures/green.png";
	  }
	}, []);
  
	/** Load texture URLs once per session; they may still expire but we now retry on error inside ClothingModel. */
	useEffect(() => {
	  if (!Array.isArray(data)) return;
	  const load = async (items, key) => {
		const map = {};
		await Promise.all(
		  items.map(async (item) => {
			map[item.name] = await fetchTextureUrl(`${item.name}_texture`);
		  })
		);
		setTextureStore((prev) => ({ ...prev, [key]: map }));
	  };
	  load(getUniqueByName(data.filter((i) => i.upper)), "upper");
	  load(getUniqueByName(data.filter((i) => i.lower)), "lower");
	}, [data, fetchTextureUrl, getUniqueByName]);
  
	const generateOptions = useCallback(
	  (items, textures, cfg) => {
		if (!Array.isArray(items)) return [];
		return getUniqueByName(items)
		  .filter((i) => textures[i.name])
		  .map((i) => ({
			...i,
			name: i.name, // explicitly include name so ClothingModel can request fresh URL
			textureUrl: textures[i.name],
			...cfg,
			price: i.price ?? 0,
			imageUrl: i.imageUrl ?? "",
		  }));
	  },
	  [getUniqueByName]
	);
  
	const upperOptions = useMemo(
	  () =>
		generateOptions(
		  data?.filter((i) => i.upper),
		  textureStore.upper,
		  { geometryUrl: "/models/bomber_jacket.glb", scale: [1, 1, 1], position: [0, -0.3, 0] }
		),
	  [data, textureStore.upper, generateOptions]
	);
	const lowerOptions = useMemo(
	  () =>
		generateOptions(
		  data?.filter((i) => i.lower),
		  textureStore.lower,
		  { geometryUrl: "/models/leg.glb", scale: [1, 1, 1], position: [0, -0.6, 0] }
		),
	  [data, textureStore.lower, generateOptions]
	);
  
	useEffect(() => {
	  if (!upperOptions.length || !lowerOptions.length) return;
	  const pid = sessionStorage.getItem("productId");
	  if (!pid) return;
	  const uIdx = upperOptions.findIndex((i) => i._id === pid);
	  const lIdx = lowerOptions.findIndex((i) => i._id === pid);
	  if (uIdx !== -1) setIndices((p) => ({ ...p, upper: uIdx }));
	  else if (lIdx !== -1) setIndices((p) => ({ ...p, lower: lIdx }));
	}, [upperOptions, lowerOptions]);
  
	useEffect(() => {
	  if (indices.upper >= upperOptions.length && upperOptions.length) {
		setIndices((p) => ({ ...p, upper: 0 }));
	  }
	}, [indices.upper, upperOptions]);
  
	const handleContextLost = useCallback((e) => {
	  e.preventDefault();
	  setAutoRotate(false);
	  setCanvasKey(Date.now());
	  setSnackbar({ message: "WebGL context lost. Reloading...", severity: "warning", show: true });
	}, []);
  
	useEffect(() => {
	  if (snackbar.severity !== "warning") setAutoRotate(true);
	}, [indices, snackbar.severity]);
  
	const handleItemChange = useCallback(
	  (type, dir) => {
		const opts = type === "upper" ? upperOptions : lowerOptions;
		if (!opts.length) return;
		setIndices((p) => {
		  const i = p[type],
			len = opts.length,
			next = dir === "next" ? (i + 1) % len : (i - 1 + len) % len;
		  return { ...p, [type]: next };
		});
	  },
	  [upperOptions, lowerOptions]
	);
  
	const showNotification = useCallback((msg, sev = "success") => {
	  setSnackbar({ message: msg, severity: sev, show: true });
	}, []);
  
	const safeGet = useCallback((arr, idx) => (arr.length ? arr[Math.max(0, Math.min(idx, arr.length - 1))] : null), []);
	const currentUpper = safeGet(upperOptions, indices.upper);
	const currentLower = safeGet(lowerOptions, indices.lower);
  
	if (!currentUpper || !currentLower) {
	  return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		  <CircularProgress />
		  <Typography sx={{ ml: 2 }}>Loading Outfit...</Typography>
		</Box>
	  );
	}
  
	const handleReset = () => {
	  setIndices({ upper: 0, lower: 0 });
	  setAutoRotate(true);
	  showNotification("Look reset to default", "info");
	};
  
	const handleAddToCart = () => {
	  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
	  [currentUpper, currentLower].forEach((item) => {
		if (!cart.some((ci) => ci.productId === item._id)) {
		  cart.push({
			productId: item._id,
			name: item.name,
			category: item.upper ? "Upper" : "Lower",
			price: item.price,
			imageUrl: item.imageUrl,
			brand: item.brand,
			size: item.size,
			quantity: 1,
		  });
		}
	  });
	  sessionStorage.setItem("cart", JSON.stringify(cart));
	  showNotification("Current outfit added to cart!");
	};
  
	const handleCloseSnackbar = (_, reason) => {
	  if (reason !== "clickaway") setSnackbar((p) => ({ ...p, show: false }));
	};
  
	return (
	  <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f5f7" }}>
		{/* Header */}
		<Box sx={{ p: { xs: 2, md: 3 }, textAlign: "center", bgcolor: "#fff", borderBottom: "1px solid #eaeaea" }}>
		  <IconButton onClick={() => navigate("/explore") } sx={{ position: "absolute", left: 10, top: 10 }}>
			<HomeIcon />
		  </IconButton>
		  <Typography variant="h4" sx={{ fontWeight: 600, color: "#333", fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
			SwipeFit Dressroom
		  </Typography>
		  <Typography variant="body1" sx={{ mt: 1, color: "#666", fontSize: { xs: "0.875rem", md: "1rem" } }}>
			Select items and see them combined in 3D
		  </Typography>
		  <IconButton
			onClick={() => navigate("/cart") }
			sx={{ position: "absolute", right: 10, top: 10, bgcolor: "#fff", border: "1px solid #eaeaea", borderRadius: "50%", p: 1 }}
		  >
			<ShoppingCartOutlinedIcon />
		  </IconButton>
		</Box>
  
		{/* Canvas */}
		<Box sx={{ flexGrow: 1, position: "relative", display: "flex", overflow: "hidden" }}>
		  <Box sx={{ flexGrow: 1, position: "relative", minHeight: "300px" }}>
			<Suspense fallback={<CanvasLoader /> }>
			  <Canvas
				key={canvasKey}
				shadows
				camera={{ position: [0, 0.5, 4], fov: 50 }}
				gl={{ preserveDrawingBuffer: true, antialias: true }}
				onCreated={({ gl }) => {
				  gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
				}}
				style={{ background: "linear-gradient(to bottom, #eef2f7, #ffffff)" }}
			  >
				<SceneContent
				  upperData={currentUpper}
				  lowerData={currentLower}
				  isAutoRotating={isAutoRotating}
				  setAutoRotate={setAutoRotate}
				/>
			  </Canvas>
			</Suspense>
		  </Box>
  
		  {/* Controls (desktop) */}
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
			  bgcolor: "#fff",
			  flexShrink: 0,
			}}
		  >
			{[
			  { icon: <RefreshIcon />, label: "Reset", handler: handleReset },
			  { icon: <ShoppingCartIcon />, label: "Add Cart", handler: handleAddToCart },
			].map((act) => (
			  <Box key={act.label} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<IconButton onClick={act.handler} sx={{ width: 50, height: 50, border: "1px solid #eaeaea", bgcolor: "#f9f9f9", "&:hover": { bgcolor: "#f0f0f0" } }}>
				  {act.icon}
				</IconButton>
				<Typography variant="caption" sx={{ mt: 0.5, textAlign: "center" }}>
				  {act.label}
				</Typography>
			  </Box>
			))}
		  </Box>
		</Box>
  
		{/* Item labels & navigation */}
		<Box
		  sx={{
			p: 2,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			gap: { xs: 1, md: 2 },
			flexWrap: "wrap",
			bgcolor: "#fff",
			borderTop: "1px solid #eaeaea",
		  }}
		>
		  {/* Shirt row */}
		  <Box
			sx={{
			  display: "flex",
			  alignItems: "center",
			  p: 1,
			  px: { xs: 1, md: 3 },
			  border: "1px solid #eaeaea",
			  borderRadius: 2,
			  bgcolor: "#fff",
			  minWidth: { xs: "150px", sm: "220px" },
			}}
		  >
			<Typography variant="subtitle1" sx={{ mr: { xs: 1, md: 2 }, fontWeight: 500, fontSize: { xs: "0.875rem", md: "1rem" } }}>
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
			  }}
			>
			  {currentUpper.name}
			</Typography>
			<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
			  <IconButton onClick={() => handleItemChange("upper", "prev")} size="small" sx={{ mr: 0.5 }}>
				<ArrowBack fontSize="small" />
			  </IconButton>
			  <IconButton onClick={() => handleItemChange("upper", "next")} size="small">
				<ArrowForward fontSize="small" />
			  </IconButton>
			</Box>
		  </Box>
  
		  {/* Pants row */}
		  <Box
			sx={{
			  display: "flex",
			  alignItems: "center",
			  p: 1,
			  px: { xs: 1, md: 3 },
			  border: "1px solid #eaeaea",
			  borderRadius: 2,
			  bgcolor: "#fff",
			  minWidth: { xs: "150px", sm: "220px" },
			}}
		  >
			<Typography variant="subtitle1" sx={{ mr: { xs: 1, md: 2 }, fontWeight: 500, fontSize: { xs: "0.875rem", md: "1rem" } }}>
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
			  }}
			>
			  {currentLower.name}
			</Typography>
			<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
			  <IconButton onClick={() => handleItemChange("lower", "prev")} size="small" sx={{ mr: 0.5 }}>
				<ArrowBack fontSize="small" />
			  </IconButton>
			  <IconButton onClick={() => handleItemChange("lower", "next")} size="small">
				<ArrowForward fontSize="small" />
			  </IconButton>
			</Box>
		  </Box>
		</Box>
  
		{/* Mobile action bar */}
		<Box
		  sx={{
			display: { xs: "flex", md: "none" },
			justifyContent: "space-around",
			p: 1.5,
			gap: 1,
			borderTop: "1px solid #eaeaea",
			bgcolor: "#fff",
		  }}
		>
		  <Button
			variant="outlined"
			startIcon={<ShoppingCartIcon />}
			onClick={handleAddToCart}
			size="small"
			sx={{ flex: 1, py: 1, borderColor: "#ccc", color: "#555", fontSize: "0.75rem" }}
		  >
			Add Cart
		  </Button>
		</Box>
  
		{/* Snackbar */}
		<Snackbar
		  open={snackbar.show}
		  autoHideDuration={3000}
		  onClose={handleCloseSnackbar}
		  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
		  <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
			{snackbar.message}
		  </Alert>
		</Snackbar>
	  </Box>
	);
  }
  
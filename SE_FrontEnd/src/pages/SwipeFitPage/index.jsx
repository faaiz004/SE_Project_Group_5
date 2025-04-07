"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import {
  Container,
  MannequinContainer,
  NavigationButton,
  ProductInfo,
  ProductCard,
  BuyButton,
  Header,
  SocialIcons,
  NavIcons,
  ConnectorLine,
  TopNavigationContainer,
  BottomNavigationContainer,
} from "./styles";

import {
  Instagram,
  Twitter,
  Facebook,
  ShoppingCart,
  User,
  Menu,
  Users,
} from "lucide-react";

import redHoodie from "../../assets/Mannequin/wp.png";
import blueDenim from "../../assets/Mannequin/bd.png";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

// Point these URLs to your hosted .obj and .mtl files:
const mannequinModel = "/models/Female_Body_Base_Model.obj";
const mannequinModelMtl = "/models/Female_Body_Base_Model.mtl";

// Sample product data
const tops = [
  {
    id: 1,
    name: "Red Hoodie",
    price: "PKR 2,500",
    color: "Black",
    sizes: "S, M, L, XL, XXL",
    season: "23-24",
    image: redHoodie,
  },
  {
    id: 2,
    name: "Blue T-Shirt",
    price: "PKR 1,800",
    color: "Blue",
    sizes: "S, M, L, XL",
    season: "23-24",
    image: blueDenim,
  },
  {
    id: 3,
    name: "White Polo",
    price: "PKR 2,200",
    color: "White",
    sizes: "M, L, XL, XXL",
    season: "23-24",
    image: redHoodie,
  },
];

const bottoms = [
  {
    id: 1,
    name: "Blue Denim Pants",
    price: "PKR 2,500",
    color: "Blue",
    sizes: "S, M, L, XL, XXL",
    season: "23-24",
    image: blueDenim,
  },
  {
    id: 2,
    name: "Black Chinos",
    price: "PKR 2,200",
    color: "Black",
    sizes: "S, M, L, XL",
    season: "23-24",
    image: redHoodie,
  },
  {
    id: 3,
    name: "Khaki Shorts",
    price: "PKR 1,800",
    color: "Khaki",
    sizes: "M, L, XL",
    season: "23-24",
    image: blueDenim,
  },
];

/* 
  ClothingMesh: creates a simple plane to display a piece of clothing 
  as a texture. We remove the child mesh on cleanup before disposing 
  geometry/material to avoid memory leaks.
*/
function ClothingMesh({ image, position }) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, image);

  useEffect(() => {
    if (!texture) return;

    // Create geometry + material
    const geometry = new THREE.PlaneGeometry(1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Create a mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(...position);

    // Add to group
    meshRef.current?.add(mesh);

    // Cleanup on unmount or re-render
    return () => {
      meshRef.current?.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [texture, position]);

  return <group ref={meshRef} />;
}

/* 
  MannequinModel: uses the MTLLoader and OBJLoader via `useLoader`. 
  This approach is recommended in React Three Fiber for reusability 
  and to avoid repeated manual loads.
*/
function MannequinModel() {
  // Load MTL
  const materials = useLoader(MTLLoader, mannequinModelMtl);
  // Preload materials
  useEffect(() => {
    materials?.preload();
  }, [materials]);

  // Then load OBJ, attaching the materials
  const model = useLoader(OBJLoader, mannequinModel, (loader) => {
    loader.setMaterials(materials);
  });

  // Adjust model once loaded
  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
      model.position.set(0, -1.1, 0);
      model.scale.set(1.2, 1.2, 1.2);
    }
  }, [model]);

  return model ? <primitive object={model} /> : null;
}

/*
  MannequinScene: sets up the Canvas and scene. 
  We only mount <Canvas> once; we just change props (topImage, bottomImage) 
  to swap textures. This prevents forced unmounting of the WebGL context.
*/
function MannequinScene({ topImage, bottomImage }) {
  return (
    <Canvas
      style={{ height: "500px" }}
      camera={{ position: [0, 1.5, 4], fov: 50 }}
      shadows
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={0.8} castShadow />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
      />

      <MannequinModel />
      {/* Add top and bottom clothing planes */}
      <ClothingMesh image={topImage} position={[0, 1.6, 0.1]} />
      <ClothingMesh image={bottomImage} position={[0, 0.5, 0.1]} />

      <gridHelper args={[10, 10]} />
    </Canvas>
  );
}

/* 
  Main component: keeps track of selected top/bottom + sizes in state, 
  and renders the above scene plus product details.
*/
export default function VirtualMannequin() {
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [selectedTopSize, setSelectedTopSize] = useState(null);
  const [selectedBottomSize, setSelectedBottomSize] = useState(null);
  const [cart, setCart] = useState([]);

  const currentTop = tops[currentTopIndex];
  const currentBottom = bottoms[currentBottomIndex];

  const nextTop = () =>
    setCurrentTopIndex((prev) => (prev + 1) % tops.length);
  const prevTop = () =>
    setCurrentTopIndex((prev) => (prev - 1 + tops.length) % tops.length);

  const nextBottom = () =>
    setCurrentBottomIndex((prev) => (prev + 1) % bottoms.length);
  const prevBottom = () =>
    setCurrentBottomIndex((prev) => (prev - 1 + bottoms.length) % bottoms.length);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert(`Added ${product.name} to cart!`);
  };

  const handleSizeSelect = (size, type) => {
    if (type === "top") {
      setSelectedTopSize(size);
    } else {
      setSelectedBottomSize(size);
    }
  };

  return (
    <Container>
      <Header>
        <div className="left">
          <Menu className="menu-icon" />
          <h1>Swipe-Fit</h1>
          <SocialIcons>
            <Instagram size={20} />
            <Twitter size={20} />
            <Facebook size={20} />
          </SocialIcons>
        </div>
        <NavIcons>
          <Users size={24} />
          <div className="cart-icon">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </div>
          <User size={24} />
        </NavIcons>
      </Header>

      <div className="content">
        <MannequinContainer>
          <MannequinScene
            topImage={currentTop.image}
            bottomImage={currentBottom.image}
          />
          <TopNavigationContainer>
            <NavigationButton onClick={prevTop}>&larr;</NavigationButton>
            <NavigationButton onClick={nextTop}>&rarr;</NavigationButton>
          </TopNavigationContainer>
          <BottomNavigationContainer>
            <NavigationButton onClick={prevBottom}>&larr;</NavigationButton>
            <NavigationButton onClick={nextBottom}>&rarr;</NavigationButton>
          </BottomNavigationContainer>
        </MannequinContainer>

        <ProductInfo>
          <ConnectorLine />
          <ProductCard>
            <h2>{currentTop.name}</h2>
            <h3>{currentTop.price}</h3>
            <div className="details">
              <p>Color: {currentTop.color}</p>
              <div>
                <p>Sizes:</p>
                <div className="size-buttons">
                  {currentTop.sizes.split(", ").map((size) => (
                    <button
                      key={size}
                      className={`size-button ${
                        selectedTopSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size, "top")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <p>Season: {currentTop.season}</p>
            </div>
            <BuyButton onClick={() => addToCart(currentTop)}>Buy Now</BuyButton>
          </ProductCard>

          <ConnectorLine />
          <ProductCard>
            <h2>{currentBottom.name}</h2>
            <h3>{currentBottom.price}</h3>
            <div className="details">
              <p>Color: {currentBottom.color}</p>
              <div>
                <p>Sizes:</p>
                <div className="size-buttons">
                  {currentBottom.sizes.split(", ").map((size) => (
                    <button
                      key={size}
                      className={`size-button ${
                        selectedBottomSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size, "bottom")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <p>Season: {currentBottom.season}</p>
            </div>
            <BuyButton onClick={() => addToCart(currentBottom)}>
              Buy Now
            </BuyButton>
          </ProductCard>
        </ProductInfo>
      </div>
    </Container>
  );
}

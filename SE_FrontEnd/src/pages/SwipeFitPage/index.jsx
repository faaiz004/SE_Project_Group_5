"use client";

import { useState } from "react";
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
  MannequinImage,
  ClothingOverlay,
  TopNavigationContainer,
  BottomNavigationContainer,
} from "./styles";
import { Instagram, Twitter, Facebook, ShoppingCart, User, Menu, Users } from "lucide-react";

// Import images so Vite can resolve them
import baseImage from "../../assets/Mannequin/base.png";
import redHoodie from "../../assets/Mannequin/wp.png";
import blueDenim from "../../assets/Mannequin/bd.png";

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
    image: redHoodie, // Using redHoodie as a placeholder
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

export default function VirtualMannequin() {
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [selectedTopSize, setSelectedTopSize] = useState(null); // Track selected top size
  const [selectedBottomSize, setSelectedBottomSize] = useState(null); // Track selected bottom size
  const [cart, setCart] = useState([]);

  const currentTop = tops[currentTopIndex];
  const currentBottom = bottoms[currentBottomIndex];

  const nextTop = () => {
    setCurrentTopIndex((prevIndex) => (prevIndex + 1) % tops.length);
  };

  const prevTop = () => {
    setCurrentTopIndex((prevIndex) => (prevIndex - 1 + tops.length) % tops.length);
  };

  const nextBottom = () => {
    setCurrentBottomIndex((prevIndex) => (prevIndex + 1) % bottoms.length);
  };

  const prevBottom = () => {
    setCurrentBottomIndex((prevIndex) => (prevIndex - 1 + bottoms.length) % bottoms.length);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
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
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
          <User size={24} />
        </NavIcons>
      </Header>

      <div className="content">
        <MannequinContainer>
          {/* Base mannequin image */}
          <MannequinImage src={baseImage} alt="Mannequin" />

          {/* Clothing overlays */}
          <ClothingOverlay src={currentTop.image} alt={currentTop.name} className="top" />
          <ClothingOverlay src={currentBottom.image} alt={currentBottom.name} className="bottom" />

          {/* Top navigation */}
          <TopNavigationContainer>
            <NavigationButton onClick={prevTop} className="prev">
              &larr;
            </NavigationButton>
            <NavigationButton onClick={nextTop} className="next">
              &rarr;
            </NavigationButton>
          </TopNavigationContainer>

          {/* Bottom navigation */}
          <BottomNavigationContainer>
            <NavigationButton onClick={prevBottom} className="prev">
              &larr;
            </NavigationButton>
            <NavigationButton onClick={nextBottom} className="next">
              &rarr;
            </NavigationButton>
          </BottomNavigationContainer>
        </MannequinContainer>

        <ProductInfo>
          {/* Top product info */}
          <ConnectorLine className="top-connector" />
          <ProductCard>
            <h2>{currentTop.name}</h2>
            <h3>{currentTop.price}</h3>
            <div className="details">
              <p>Color: {currentTop.color}</p>
              <div>
                <p>Sizes:</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {currentTop.sizes.split(", ").map((size) => (
                    <button
                      key={size}
                      style={{
                        padding: "5px 10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: selectedTopSize === size ? "black" : "#fff", // Highlight selected size
                        color: selectedTopSize === size ? "white" : "black", // Change text color for selected size
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "translateY(-3px)")} // Hover effect
                      onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")} // Reset hover effect
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

          {/* Bottom product info */}
          <ConnectorLine className="bottom-connector" />
          <ProductCard>
            <h2>{currentBottom.name}</h2>
            <h3>{currentBottom.price}</h3>
            <div className="details">
              <p>Color: {currentBottom.color}</p>
              <div>
                <p>Sizes:</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {currentBottom.sizes.split(", ").map((size) => (
                    <button
                      key={size}
                      style={{
                        padding: "5px 10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: selectedBottomSize === size ? "black" : "#fff", // Highlight selected size
                        color: selectedBottomSize === size ? "white" : "black", // Change text color for selected size
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "translateY(-3px)")} // Hover effect
                      onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")} // Reset hover effect
                      onClick={() => handleSizeSelect(size, "bottom")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <p>Season: {currentBottom.season}</p>
            </div>
            <BuyButton onClick={() => addToCart(currentBottom)}>Buy Now</BuyButton>
          </ProductCard>
        </ProductInfo>
      </div>
    </Container>
  );
}
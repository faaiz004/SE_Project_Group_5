import styled from "styled-components"

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Arial', sans-serif;
  
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  
  .left {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
  
  .menu-icon {
    cursor: pointer;
  }
`

export const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-left: 20px;
  
  svg {
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

export const NavIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  svg {
    cursor: pointer;
  }
  
  .cart-icon {
    position: relative;
  }
  
  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #000;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`

export const MannequinContainer = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  justify-content: center;
  min-height: 500px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

export const MannequinImage = styled.img`
  height: 600px; /* Increased height to make the mannequin bigger */
  object-fit: contain;
  position: absolute;
  z-index: 1;
`

export const ClothingOverlay = styled.img`
  height: 250px;
  object-fit: contain;
  position: absolute;
  z-index: 2;

  &.top {
    top: 80px; /* Added margin to move the top clothing down */
  }

  &.bottom {
    bottom: 0px; /* Adjusted bottom clothing position */
  }
`

export const TopNavigationContainer = styled.div`
  position: absolute;
  top: 30%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 3;
`

export const BottomNavigationContainer = styled.div`
  position: absolute;
  bottom: 30%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 3;
`

export const NavigationButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    transform: scale(1.05);
  }
  
  &.prev {
    margin-left: -20px;
  }
  
  &.next {
    margin-right: -20px;
  }
`

export const ProductInfo = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

export const ConnectorLine = styled.div`
  position: relative;
  height: 2px;
  background-color: #ccc;
  width: 100px;
  margin-left: -50px;
  
  &.top-connector {
    top: 30%;
  }
  
  &.bottom-connector {
    top: 10%;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

export const ProductCard = styled.div`
  background-color: #333;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin: 0 0 5px 0;
    font-size: 20px;
  }
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
  }
  
  .details {
    margin-bottom: 15px;
    
    p {
      margin: 5px 0;
      color: #ccc;
      font-size: 14px;
    }
  }
`

export const BuyButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: white;
  color: #333;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`


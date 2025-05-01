"use client"

import { useState, useEffect } from "react"
import { Typography, Box, IconButton, Badge } from "@mui/material"
import { Facebook, Twitter, Instagram, GroupAdd, ShoppingCart, Person } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { ClothesBox, HeaderBox, ImageBox, root, SearchBox } from "./Styles"
import SearchBar from "../../Layouts/ExplorePage/SearchBar"
import ExploreClothes from "../../Layouts/ExplorePage/ExploreClothes"

const ExplorePage = () => {
  const navigate = useNavigate()
  // State to track cart items
  const [cartItems, setCartItems] = useState([])

  // Load cart items from sessionStorage on component mount
  useEffect(() => {
    // Function to update cart state from storage
    const updateCartFromStorage = () => {
      try {
        const storedCart = sessionStorage.getItem("cart")
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart)
          }
        }
      } catch (error) {
        console.error("Error parsing cart data:", error)
      }
    }

    // Initial load
    updateCartFromStorage()

    // Set up interval to check for cart updates
    const intervalId = setInterval(updateCartFromStorage, 300)

    // Override sessionStorage.setItem to detect cart updates
    const originalSetItem = sessionStorage.setItem
    sessionStorage.setItem = function (key, value) {
      // Call original function
      originalSetItem.apply(this, arguments)

      // If the cart is being updated, update our state
      if (key === "cart") {
        try {
          const parsedValue = JSON.parse(value)
          if (Array.isArray(parsedValue)) {
            setCartItems(parsedValue)
          }
        } catch (error) {
          console.error("Error parsing cart data:", error)
        }
      }
    }

    // Clean up
    return () => {
      clearInterval(intervalId)
      // Restore original sessionStorage.setItem
      sessionStorage.setItem = originalSetItem
    }
  }, [])

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product)
    // Create updated cart
    const updatedCart = [...cartItems, product]
    // Update state immediately
    setCartItems(updatedCart)
    // Save to sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(updatedCart))

    // Add this after setting sessionStorage in handleAddToCart
    // Dispatch a custom event to notify other components
    const cartUpdateEvent = new Event("cartUpdated")
    window.dispatchEvent(cartUpdateEvent)
  }

  return (
    <Box sx={root}>
      {/* Background Image */}
      <Box sx={ImageBox}>
        <Box sx={HeaderBox}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 700,
                color: "white",
              }}
            >
              Swipe-Fit
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  marginTop: 0,
                }}
              >
                <Instagram
                  sx={{ color: "white", fontSize: 30, cursor: "pointer" }}
                  onClick={() => window.open("https://www.instagram.com", "_blank")}
                />
                <Twitter
                  sx={{ color: "white", fontSize: 30, cursor: "pointer" }}
                  onClick={() => window.open("https://www.twitter.com", "_blank")}
                />
                <Facebook
                  sx={{ color: "white", fontSize: 30, cursor: "pointer" }}
                  onClick={() => window.open("https://www.facebook.com", "_blank")}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              marginTop: 2,
            }}
          >
            <IconButton onClick={() => navigate("/stylefeed")}>
              <GroupAdd sx={{ color: "white", fontSize: 30 }} />
            </IconButton>

            <IconButton onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={cartItems.length}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    right: 0,
                    top: 0,
                    border: "2px solid white",
                    padding: "0 4px",
                  },
                }}
              >
                <ShoppingCart sx={{ color: "white", fontSize: 30 }} />
              </Badge>
            </IconButton>
            <IconButton onClick={() => navigate("/account")}>
              <Person sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>
        {/* Search Bar */}
        <Box sx={SearchBox}>
          <SearchBar />
        </Box>
      </Box>
      {/* Main Content */}
      <Box sx={ClothesBox}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingY: 4,
            width: "100%",
            backgroundColor: "#f0f0f0",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 40,
              fontWeight: 700,
              color: "#27374D",
            }}
          >
            Explore Trending Searches
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 400,
              color: "#27374D",
            }}
          >
            Shop, Vibe, and Relax
          </Typography>
        </Box>
        <ExploreClothes onAddToCart={handleAddToCart} />
      </Box>
    </Box>
  )
}

export default ExplorePage
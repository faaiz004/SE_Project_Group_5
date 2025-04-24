"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  Skeleton,
  TextField,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import SearchIcon from "@mui/icons-material/Search"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"

// existing services & queries
import { fetchOutfits } from "../../pages/ExplorePage/constants"
import { saveClothes, unsaveClothes, getSavedClothes } from "../../services/S_U_Posts/Index"

import {
  pageContainer,
  headerContainer,
  logoStyle,
  headerIconsContainer,
  searchContainer,
  contentContainer,
  titleStyle,
  gridContainer,
  cardStyle,
  buttonStyle,
  buttonContainerStyle,
  searchInputStyle,
} from "./styles"

export default function AllClothesSearch() {
  const navigate = useNavigate()
  const [savedStates, setSavedStates] = useState({})
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // fetch all clothes
  const {
    data: clothes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allClothes"],
    queryFn: fetchOutfits,
  })

  // initialize cart & saved flags
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cart")) || []
    setCartItems(stored)
    ;(async () => {
      try {
        const saved = await getSavedClothes()
        const init = {}
        saved.forEach((c) => {
          init[c._id] = true
        })
        setSavedStates(init)
      } catch (e) {
        console.error("Failed to fetch saved clothes:", e)
      }
    })()
  }, [])

  // mutations
  const saveMutation = useMutation({
    mutationFn: saveClothes,
    onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: false })),
  })

  const unsaveMutation = useMutation({
    mutationFn: unsaveClothes,
    onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: true })),
  })

  const handleToggleSave = (id) => {
    const was = !!savedStates[id]
    setSavedStates((s) => ({ ...s, [id]: !was }))
    was ? unsaveMutation.mutate(id) : saveMutation.mutate(id)
  }

  const handleAddToCart = (item, imageUrl) => {
    if (cartItems.some((ci) => ci.productId === item._id)) return
    const entry = {
      productId: item._id,
      name: item.name,
      brand: item.brand,
      size: item.size,
      category: item.category,
      price: item.price,
      imageUrl,
      quantity: 1,
    }
    const updated = [...cartItems, entry]
    sessionStorage.setItem("cart", JSON.stringify(updated))
    setCartItems(updated)
  }

  // Filter clothes based on search query
  const filteredClothes = clothes.filter((item) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.brand && item.brand.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    )
  })

  // Remove duplicates by name only (ignoring size)
  const nameMap = new Map()
  const uniqueClothes = filteredClothes.filter((item) => {
    // Use only the name as the key
    const key = item.name

    // If this name already exists, filter it out
    if (nameMap.has(key)) {
      return false
    }

    // Otherwise, keep it and mark this name as seen
    nameMap.set(key, true)
    return true
  })

  const renderCard = (item) => {
    const raw = item.signedImageUrl || item.imageUrl || ""
    const imageUrl = raw.replace("/thumbnails/thumbnails/", "/thumbnails/")
    const isSaved = !!savedStates[item._id]
    const isInCart = cartItems.some((ci) => ci.productId === item._id)

    return (
      <Card key={item._id} sx={cardStyle}>
        <CardMedia
          component="img"
          src={imageUrl}
          alt={item.name || "Clothing item"}
          height="220"
          imgProps={{ loading: "lazy" }}
          sx={{ objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate("/mannequin")}
        />
        <Box sx={buttonContainerStyle}>
          <Button
            fullWidth
            size="small"
            onClick={() => handleAddToCart(item, imageUrl)}
            disabled={isInCart}
            sx={{
              ...buttonStyle,
              "&.Mui-disabled": { bgcolor: "#2D333A", color: "#fff" },
            }}
          >
            {isInCart ? "Added" : "Add to Cart"}
          </Button>
          <Button fullWidth size="small" onClick={() => handleToggleSave(item._id)} sx={buttonStyle}>
            {isSaved ? "Unsave" : "Save"}
          </Button>
        </Box>
      </Card>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={gridContainer}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      )
    }

    if (isError) return <Typography>Error: {error.message}</Typography>

    if (uniqueClothes.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">No items match your search</Typography>
          <Typography color="text.secondary">Try adjusting your search criteria</Typography>
        </Box>
      )
    }

    return (
      <Box sx={gridContainer}>
        {uniqueClothes.map((item) => (
          <Box key={item._id} sx={{ width: "100%" }}>
            {renderCard(item)}
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={pageContainer}>
      {/* Header with logo and icons */}
      <Box sx={{ width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={headerContainer}>
          <Link href="/explore" sx={logoStyle}>
            Swipe-Fit
          </Link>
          <Box sx={headerIconsContainer}>
            <IconButton>
              <PersonOutlineIcon />
            </IconButton>
            <IconButton>
              <ShoppingCartOutlinedIcon />
              {cartItems.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "#2D333A",
                    color: "white",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartItems.length}
                </Box>
              )}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Search bar - centered and pill-shaped */}
      <Box sx={searchContainer}>
        <TextField
          placeholder="Search clothes by name, brand, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={searchInputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Main content */}
      <Box sx={contentContainer}>
        <Typography sx={titleStyle}>All Clothes</Typography>
        {renderContent()}
      </Box>
    </Box>
  )
}

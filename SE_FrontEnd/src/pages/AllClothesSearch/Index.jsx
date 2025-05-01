import { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";

import {
  fetchOutfits,
  saveClothes,
  unsaveClothes,
  getSavedClothes,
  getUserPreferences,
} from "../../api/clothesService";
import { fetchTextureByName } from "../../api/texturesService";

import {
  pageContainer,
  headerContainer,
  headerIconsContainer,
  contentContainer,
  gridContainer,
  cardStyle,
  buttonStyle,
  buttonContainerStyle,
  searchInputStyle,
} from "./styles";

export default function AllClothesSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const [savedStates, setSavedStates] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPrefs, setUserPrefs] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState("");

  const {
    data: clothes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allClothes"],
    queryFn: fetchOutfits,
  });

  const filteredClothes = useMemo(() => {
    const filterTarget = filteredCategory || category;
    return clothes.filter((item) =>
      filterTarget
        ? item.category?.toLowerCase() === filterTarget.toLowerCase()
        : true
    );
  }, [clothes, category, filteredCategory]);

  const fetchSearchCategoryFromOpenAI = async (prompt) => {
    // ... existing implementation ...
  };

  const handleImageClick = async (item) => {
    // ... existing implementation ...
  };

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(stored);

    (async () => {
      try {
        const saved = await getSavedClothes();
        const init = {};
        saved.forEach((c) => (init[c._id] = true));
        setSavedStates(init);

        const prefs = await getUserPreferences();
        setUserPrefs(prefs);
      } catch (e) {
        console.error("Init failed:", e);
      }
    })();
  }, []);

  useEffect(() => {
    const updateCartFromStorage = () => {
      try {
        const storedCart = sessionStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    };

    const intervalId = setInterval(updateCartFromStorage, 300);
    return () => clearInterval(intervalId);
  }, []);

  const saveMutation = useMutation({
    mutationFn: saveClothes,
    onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: false })),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveClothes,
    onError: (_, id) => setSavedStates((s) => ({ ...s, [id]: true })),
  });

  const handleToggleSave = (id) => {
    const was = !!savedStates[id];
    setSavedStates((s) => ({ ...s, [id]: !was }));
    was ? unsaveMutation.mutate(id) : saveMutation.mutate(id);
  };

  const handleAddToCart = (item, imageUrl) => {
    if (cartItems.some((ci) => ci.productId === item._id)) return;
    const entry = {
      productId: item._id,
      name: item.name,
      brand: item.brand,
      size: item.size,
      category: item.category,
      price: item.price,
      imageUrl,
      quantity: 1,
    };
    const updated = [...cartItems, entry];
    sessionStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const nameMap = new Map();
  const uniqueClothes = filteredClothes.filter((item) => {
    if (nameMap.has(item.name)) return false;
    nameMap.set(item.name, true);
    return true;
  });

  const matchesPrefs = (item) => {
    if (!userPrefs) return false;
    return (
      item.size === userPrefs.size &&
      item.style === userPrefs.style &&
      item.gender === userPrefs.gender
    );
  };

  const personalizedClothes = uniqueClothes.filter(matchesPrefs);
  const otherClothes = uniqueClothes.filter((item) => !matchesPrefs(item));

  const renderCard = (item) => {
    const raw = item.signedImageUrl || item.imageUrl || "";
    const imageUrl = raw.replace("/thumbnails/thumbnails/", "/thumbnails/");
    const isSaved = !!savedStates[item._id];
    const isInCart = cartItems.some((ci) => ci.productId === item._id);

    return (
      <Card key={item._id} sx={cardStyle}>
        <CardMedia
          component="img"
          src={imageUrl}
          alt={item.name || "Clothing item"}
          height="220"
          imgProps={{ loading: "lazy" }}
          sx={{ objectFit: "contain", cursor: "pointer" }}
          onClick={() => handleImageClick(item)}
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
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={gridContainer}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      );
    }

    if (isError) return <Typography>Error: {error.message}</Typography>;

    if (uniqueClothes.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">No items match your search</Typography>
          <Typography color="text.secondary">Try adjusting your search criteria</Typography>
        </Box>
      );
    }

    return (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Showing results for: {filteredCategory || category || "All Categories"}
        </Typography>
        {personalizedClothes.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              For You ❤️
            </Typography>
            <Box sx={gridContainer}>
              {personalizedClothes.map((item) => (
                <Box key={item._id}>{renderCard(item)}</Box>
              ))}
            </Box>
          </>
        )}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          All Results
        </Typography>
        <Box sx={gridContainer}>
          {otherClothes.map((item) => (
            <Box key={item._id}>{renderCard(item)}</Box>
          ))}
        </Box>
      </>
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const parsed = await fetchSearchCategoryFromOpenAI(searchQuery);
    if (!parsed) return alert("Could not understand your query.");

    setFilteredCategory(parsed.category);
  };

  return (
    <Box sx={pageContainer}>
      {/* Top bar with search included */}
      <Box sx={{ width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={headerContainer}>
          <Typography
            variant="h4"
            sx={{
              flexShrink: 0,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform .2s",
              "&:hover": { transform: "scale(1.03)" },
              color: "#000000",
              mr: 2,
            }}
            onClick={() => navigate("/explore")}
          >
            Swipe-Fit
          </Typography>

          {/* Search bar */}
          <Box sx={{ flexGrow: 1, ml: 17, mr: 2 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Search for clothes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  sx: {
                    height: 40,
                    borderRadius: "20px",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" type="submit">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ ...searchInputStyle }}
              />
            </form>
          </Box>

          {/* Icons: GroupAdd, CART, PERSON */}
          <Box sx={headerIconsContainer}>
            <IconButton onClick={() => navigate("/stylefeed")}>
              <GroupAddIcon />
            </IconButton>
            <Box sx={{ position: "relative" }}>
              <IconButton onClick={() => navigate("/cart")}>
                <ShoppingCartIcon />
              </IconButton>
              {cartItems.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "#FF5733",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {cartItems.length}
                </Box>
              )}
            </Box>
            <IconButton onClick={() => navigate("/profile")}>
              <PersonIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Content below unchanged */}
      <Box sx={contentContainer}>{renderContent()}</Box>
    </Box>
  );
}

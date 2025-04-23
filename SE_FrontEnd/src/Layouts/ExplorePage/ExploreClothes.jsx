import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  Skeleton
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchOutfits } from "../../pages/ExplorePage/constants";
import {
  saveClothes,
  unsaveClothes,
  getSavedClothes
} from "../../services/S_U_Posts/Index";
import { useNavigate } from "react-router-dom";

const root = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  backgroundColor: "#f0f0f0",
  fontFamily: "Inter, sans-serif",
};

export default function ExploreClothes() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["outfits"],
    queryFn: fetchOutfits,
  });

  const navigate = useNavigate();
  const scrollContainerRefs = useRef({});
  const [savedStates, setSavedStates] = useState({});
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from sessionStorage
    const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(existingCart);

    // Fetch saved clothes
    const fetchSaved = async () => {
      try {
        const saved = await getSavedClothes();
        const initial = {};
        saved.forEach((c) => {
          initial[c._id] = true;
        });
        setSavedStates(initial);
      } catch (err) {
        console.error("Failed to fetch saved clothes:", err);
      }
    };
    fetchSaved();
  }, []);

  const saveMutation = useMutation({
    mutationFn: saveClothes,
    onError: (_, clothesId) => {
      setSavedStates((p) => ({ ...p, [clothesId]: false }));
    },
  });
  const unsaveMutation = useMutation({
    mutationFn: unsaveClothes,
    onError: (_, clothesId) => {
      setSavedStates((p) => ({ ...p, [clothesId]: true }));
    },
  });

  const handleToggleSave = (clothesId) => {
    const was = savedStates[clothesId] || false;
    setSavedStates((p) => ({ ...p, [clothesId]: !was }));
    if (!was) saveMutation.mutate(clothesId);
    else unsaveMutation.mutate(clothesId);
  };

  const handleAddToCart = (item, imageUrl) => {
    // **NEW GUARD**: if already in cart, do nothing
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

  const handleScroll = (groupName, dir) => {
    const c = scrollContainerRefs.current[groupName];
    if (!c) return;
    const amount = c.clientWidth * 0.8;
    c.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <Box sx={root}>
        {[0, 1].map((_, i) => (
          <Box key={i} sx={{ width: "90%", maxWidth: 1200, mb: 4 }}>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 4 }}>
              {[...Array(4)].map((__, j) => (
                <Skeleton
                  key={j}
                  variant="rectangular"
                  width="22%"
                  height={320}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  if (isError) return <Typography>Error: {error.message}</Typography>;

  // Group into categories
  const categoriesMap = data.reduce((acc, o) => {
    const type = o.upper ? "Uppers" : "Lowers";
    const key = `${o.category} - ${type}`;
    (acc[key] = acc[key] || []).push(o);
    return acc;
  }, {});
  const categories = Object.entries(categoriesMap);

  return (
    <Box sx={root}>
      {categories.map(([groupName, outfits]) => {
        const unique = outfits.filter(
          (o, i, arr) => arr.findIndex((x) => x.name === o.name) === i
        );
        const first = unique[0] || {};
        const prefixMap = {
          SF_BL: "Blazers",
          SF_DS: "Dress Shirts",
          SF_JN: "Jeans",
          SF_PT: "Pants / Trousers",
          SF_PS: "Polo Shirts",
          SF_SR: "Shorts",
          SF_TS: "T-Shirts",
        };
        let label = first.category || "";
        for (const pre in prefixMap) {
          if (first.name?.startsWith(pre)) {
            label = `${prefixMap[pre]} - ${
              first.upper ? "Uppers" : "Lowers"
            }`;
            break;
          }
        }

        return (
          <Box key={groupName} sx={{ width: "90%", maxWidth: 1200, mb: 4 }}>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 600,
                color: "#27374D",
                mb: 2,
              }}
            >
              {label}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIosNewIcon
                onClick={() => handleScroll(groupName, "left")}
                sx={{ cursor: "pointer" }}
              />
              <Box
                ref={(el) =>
                  (scrollContainerRefs.current[groupName] = el)
                }
                sx={{
                  display: "flex",
                  flex: 1,
                  gap: 4,
                  overflowX: "auto",
                  px: 2,
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {unique.map((item) => {
                  const raw = item.signedImageUrl || item.imageUrl || "";
                  const imageUrl = raw.replace(
                    "/thumbnails/thumbnails/",
                    "/thumbnails/"
                  );
                  const isSaved = savedStates[item._id] || false;
                  const isInCart = cartItems.some(
                    (ci) => ci.productId === item._id
                  );

                  return (
                    <Box
                      key={item._id}
                      sx={{
                        flex: "0 0 auto",
                        width: { xs: "85%", sm: "40%", md: "22%" },
                        minWidth: 200,
                      }}
                    >
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 3,
                          bgcolor: "#fff",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.05)", zIndex: 1 },
                        }}
                      >
                        <Box sx={{ px: 1, pt: 1 }}>
                          <CardMedia
                            component="img"
                            src={imageUrl}
                            alt={item.category}
                            height="260"
                            imgProps={{ loading: "lazy" }}
                            sx={{ objectFit: "contain" }}
                            onClick={() => navigate("/mannequin")}
                          />
                        </Box>

                        <Box sx={{ px: 1, py: 1, display: "flex", gap: 1 }}>
                          <Button
                            fullWidth
                            onClick={() =>
                              handleAddToCart(item, imageUrl)
                            }
                            disabled={isInCart}
                            sx={{
                              bgcolor: "#2D333A",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: 16,
                              "&:hover": { bgcolor: "#1f2428" },
                              "&.Mui-disabled": {
                                bgcolor: "#2D333A",
                                color: "#fff",
                              },
                            }}
                          >
                            {isInCart ? "Added" : "Add to Cart"}
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => handleToggleSave(item._id)}
                            sx={{
                              bgcolor: "#2D333A",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: 16,
                              "&:hover": { bgcolor: "#1f2428" },
                            }}
                          >
                            {isSaved ? "Unsave" : "Save"}
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
              <ArrowForwardIosIcon
                onClick={() => handleScroll(groupName, "right")}
                sx={{ cursor: "pointer" }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

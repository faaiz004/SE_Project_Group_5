import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Card, CardMedia, Button, Skeleton
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  fetchOutfits,
  saveClothes,
  unsaveClothes,
  getSavedClothes,
  getUserPreferences
} from "../../api/clothesService";
import { useNavigate } from "react-router-dom";

const root = {
  display: "flex", flexDirection: "column", alignItems: "center",
  width: "100%", backgroundColor: "#f0f0f0", fontFamily: "Inter, sans-serif"
};

// size & style mappings
const sizeMap = { small: "S", medium: "M", large: "L" };
const styleMatchMap = {
  Casual_Everyday:   ["Casual_Everyday", "Smart_Casual"],
  Smart_Casual: ["Smart_Casual"],
  Modern:   ["Modern"],
  Old_Money: ["Modern"]
};

export default function ExploreClothes() {
  const navigate = useNavigate();
  const scrollContainerRefs = useRef({});
  const [savedStates, setSavedStates] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const {
    data: outfits = [], isLoading: oL, isError: oE, error: oErr
  } = useQuery({ queryKey: ["outfits"], queryFn: fetchOutfits });

  const {
    data: prefResp = {}, isLoading: pL, isError: pE, error: pErr
  } = useQuery({ queryKey: ["preferences"], queryFn: getUserPreferences });

  // init cart & saved states
  useEffect(() => {
    setCartItems(JSON.parse(sessionStorage.getItem("cart")) || []);
    (async () => {
      try {
        const saved = await getSavedClothes();
        const init = {};
        saved.forEach(c => { init[c._id] = true });
        setSavedStates(init);
      } catch (e) {
        console.error("Failed to fetch saved clothes:", e);
      }
    })();
  }, []);

  // compute "For You" list via useMemo (with gender filter)
  const forYou = useMemo(() => {
    const prefs = prefResp.preferences;
    if (!prefs || !Array.isArray(outfits)) return [];
    const { shirtSize, pantSize, stylePreference, gender: userGender } = prefs;
    const shirtMapped = sizeMap[shirtSize];
    const pantMapped = sizeMap[pantSize];
    const matchingStyles = styleMatchMap[stylePreference] || [];

    console.log("User preference:", stylePreference);
    console.log("Expected categories:", matchingStyles);

    const filtered = outfits.filter(o => {
      const sizeOK = o.upper
        ? shirtMapped === o.size
        : pantMapped === o.size;
      const styleOK = !stylePreference
        || matchingStyles.includes(o.category);
      const genderOK = o.gender === "Unisex" || o.gender === userGender;
      if (!styleOK && sizeOK && genderOK) {
        console.log("Style mismatch:", {
          userPreference: stylePreference,
          lookingFor: matchingStyles,
          itemCategory: o.category,
          itemName: o.name
        });
      }

      return sizeOK && styleOK && genderOK;
    });

    const seen = new Set();
    return filtered.filter(item => {
      const key = `${item.name}-${item.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [prefResp.preferences, outfits]);

  useEffect(() => {
    if (forYou.length) {
      forYou.forEach(item => {
        console.log(item.signedImageUrl || item.imageUrl);
      });
    }
  }, [forYou]);

  const saveM = useMutation({
    mutationFn: saveClothes,
    onError: (_, id) => setSavedStates(s => ({ ...s, [id]: false }))
  });
  const unsaveM = useMutation({
    mutationFn: unsaveClothes,
    onError: (_, id) => setSavedStates(s => ({ ...s, [id]: true }))
  });

  const handleToggleSave = id => {
    const was = savedStates[id] || false;
    setSavedStates(s => ({ ...s, [id]: !was }));
    was ? unsaveM.mutate(id) : saveM.mutate(id);
  };

  const handleAddToCart = (item, imageUrl) => {
    if (cartItems.some(ci => ci.productId === item._id)) return;
    const entry = {
      productId: item._id,
      name: item.name,
      brand: item.brand,
      size: item.size,
      category: item.category,
      price: item.price,
      imageUrl,
      quantity: 1
    };
    const updated = [...cartItems, entry];
    sessionStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const handleScroll = (key, dir) => {
    const el = scrollContainerRefs.current[key];
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const renderCard = item => {
    const img = item.signedImageUrl || item.imageUrl || "";
    const isSaved = !!savedStates[item._id];
    const isInCart = cartItems.some(ci => ci.productId === item._id);

    return (
      <Box key={item._id} sx={{ flex: "0 0 auto", width: { xs: "85%", sm: "40%", md: "22%" }, minWidth: 200 }}>
        <Card sx={{
          display: "flex", flexDirection: "column",
          borderRadius: 2, overflow: "hidden", boxShadow: 3, bgcolor: "#fff",
          transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)", zIndex: 1 }
        }}>
          <Box sx={{ px: 1, pt: 1 }}>
            <CardMedia
              component="img"
              image={img}
              alt={item.category}
              height="260"
              loading="lazy"
              sx={{ objectFit: "contain" }}
              onClick={() => navigate("/mannequin")}
            />
          </Box>
          <Box sx={{ px: 1, py: 1, display: "flex", gap: 1 }}>
            <Button
              fullWidth
              onClick={() => handleAddToCart(item, img)}
              disabled={isInCart}
              sx={{
                bgcolor: "#2D333A", color: "#fff", textTransform: "none", fontSize: 16,
                "&:hover": { bgcolor: "#1f2428" },
                "&.Mui-disabled": { bgcolor: "#2D333A", color: "#fff" }
              }}
            >
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
            <Button
              fullWidth
              onClick={() => handleToggleSave(item._id)}
              sx={{
                bgcolor: "#2D333A", color: "#fff", textTransform: "none", fontSize: 16,
                "&:hover": { bgcolor: "#1f2428" }
              }}
            >
              {isSaved ? "Unsave" : "Save"}
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  // loading / error states
  if (oL || pL) {
    return (
      <Box sx={root}>
        {[0, 1].map(i => (
          <Box key={i} sx={{ width: "90%", maxWidth: 1200, mb: 4 }}>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 4 }}>
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} variant="rectangular" width="22%" height={320} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  if (oE) return <Typography>Error: {oErr.message}</Typography>;
  if (pE) return <Typography>Error: {pErr.message}</Typography>;

  // group other categories
  const categoriesMap = outfits.reduce((acc, o) => {
    const type = o.upper ? "Uppers" : "Lowers";
    const key = `${o.category} - ${type}`;
    (acc[key] = acc[key] || []).push(o);
    return acc;
  }, {});
  const categories = Object.entries(categoriesMap);

  return (
    <Box sx={root}>

      {/* For You ❤️ */}
      <Box sx={{ width: "90%", maxWidth: 1200, mb: 6 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 600, color: "#27374D", mb: 2 }}>
          For You ❤️
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIosNewIcon onClick={() => handleScroll("forYou", "left")} sx={{ cursor: "pointer" }} />
          <Box
            ref={el => scrollContainerRefs.current["forYou"] = el}
            sx={{
              display: "flex", flex: 1, gap: 4, overflowX: "auto", px: 2,
              "&::-webkit-scrollbar": { display: "none" }
            }}
          >
            {forYou.length > 0
              ? forYou.map(renderCard)
              : <Typography>No items match your preferences.</Typography>
            }
          </Box>
          <ArrowForwardIosIcon onClick={() => handleScroll("forYou", "right")} sx={{ cursor: "pointer" }} />
        </Box>
      </Box>

      {/* Other categories */}
      {categories.map(([groupName, items]) => {
        const unique = items.filter((o, i, arr) => arr.findIndex(x => x.name === o.name) === i);
        const first = unique[0] || {};
        const prefixMap = {
          SF_BL: "Blazers", SF_FBL: "Blazers", SF_CT: "T-Shirts", SF_SK: "Shorts", SF_DS: "Dress Shirts", SF_JN: "Jeans",
          SF_PT: "Pants / Trousers", SF_PS: "Polo Shirts", SF_SR: "Shorts", SF_TS: "T-Shirts"
        };
        let label = first.category || "";
        for (const pre in prefixMap) {
          if (first.name?.startsWith(pre)) {
            label = `${prefixMap[pre]} - ${first.upper ? "Uppers" : "Lowers"}`;
            break;
          }
        }
        return (
          <Box key={groupName} sx={{ width: "90%", maxWidth: 1200, mb: 4 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 600, color: "#27374D", mb: 2 }}>
              {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIosNewIcon onClick={() => handleScroll(groupName, "left")} sx={{ cursor: "pointer" }} />
              <Box
                ref={el => scrollContainerRefs.current[groupName] = el}
                sx={{
                  display: "flex", flex: 1, gap: 4, overflowX: "auto", px: 2,
                  "&::-webkit-scrollbar": { display: "none" }
                }}
              >
                {unique.map(renderCard)}
              </Box>
              <ArrowForwardIosIcon onClick={() => handleScroll(groupName, "right")} sx={{ cursor: "pointer" }} />
            </Box>
          </Box>
        );
      })}

    </Box>
  );
}
import React, { useRef, useState, useEffect } from "react";
import {
  Box, Typography, Card, CardMedia, Button, Skeleton
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchOutfits } from "../../pages/ExplorePage/constants";
import { saveClothes, unsaveClothes, getSavedClothes } from "../../services/S_U_Posts/Index";
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
  const [savedStates, setSavedStates] = useState({});  // Track saved clothes

  // Fetch saved clothes on mount
  useEffect(() => {
    const fetchSaved = async () => {
        try {
            const savedClothes = await getSavedClothes();  // Now this is an array
            const initialState = {};
            savedClothes.forEach(cloth => {
                initialState[cloth._id] = true;
            });
            setSavedStates(initialState);
        } catch (err) {
            console.error("Failed to fetch saved clothes:", err);
        }
    };
    fetchSaved();
}, []);


  const saveMutation = useMutation({
    mutationFn: saveClothes,
    onError: (err, clothesId) => {
      setSavedStates(prev => ({ ...prev, [clothesId]: false }));
    }
  });
  
  const unsaveMutation = useMutation({
    mutationFn: unsaveClothes,
    onError: (err, clothesId) => {
      setSavedStates(prev => ({ ...prev, [clothesId]: true }));
    }
  });
  
  const handleToggleSave = (clothesId) => {
    const currentlySaved = savedStates[clothesId] || false;
    setSavedStates(prev => ({ ...prev, [clothesId]: !currentlySaved }));

    if (!currentlySaved) {
      saveMutation.mutate(clothesId);
    } else {
      unsaveMutation.mutate(clothesId);
    }
  };

  const handleScroll = (groupName, direction) => {
    const container = scrollContainerRefs.current[groupName];
    if (!container) return;
    container.scrollBy({ left: direction === "left" ? -container.clientWidth * 0.8 : container.clientWidth * 0.8, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <Box sx={root}>
        {[0, 1].map((_, idx) => (
          <Box key={idx} sx={{ width: "90%", maxWidth: 1200, mb: 4 }}>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 4 }}>
              {[...Array(4)].map((__, i) => (
                <Skeleton key={i} variant="rectangular" width="22%" height={320} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (isError) return <Typography>Error: {error.message}</Typography>;

  const categoriesMap = data.reduce((acc, outfit) => {
    const type = outfit.upper ? "Uppers" : "Lowers";
    const key = `${outfit.category} - ${type}`;
    (acc[key] = acc[key] || []).push(outfit);
    return acc;
  }, {});
  const categoriesArr = Object.entries(categoriesMap);

  return (
    <Box sx={root}>
      {categoriesArr.map(([groupName, outfits]) => {
        const unique = outfits.filter((o, i, arr) => arr.findIndex(x => x.name === o.name) === i);

        const first = unique[0] || {};
        const prefixMap = {
          SF_BL: "Blazers", SF_DS: "Dress Shirts", SF_JN: "Jeans",
          SF_PT: "Pants / Trousers", SF_PS: "Polo Shirts",
          SF_SR: "Shorts", SF_TS: "T-Shirts"
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
            <Typography sx={{ fontSize: 28, fontWeight: 600, color: "#27374D", mb: 2 }}>{label}</Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIosNewIcon onClick={() => handleScroll(groupName, "left")} sx={{ cursor: "pointer" }} />

              <Box
                ref={(el) => (scrollContainerRefs.current[groupName] = el)}
                sx={{ display: "flex", flex: 1, gap: 4, overflowX: "auto", px: 2, "&::-webkit-scrollbar": { display: "none" } }}
              >
                {unique.map((item) => {
                  const raw = item.signedImageUrl || item.imageUrl || "";
                  const imageUrl = raw.replace("/thumbnails/thumbnails/", "/thumbnails/");
                  const isSaved = savedStates[item._id] || false;

                  return (
                    <Box key={item._id} sx={{ flex: "0 0 auto", width: { xs: "85%", sm: "40%", md: "22%" }, minWidth: 200 }}>
                      <Card sx={{
                        display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden", boxShadow: 3, bgcolor: "#fff",
                        transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.05)", zIndex: 1 },
                      }}>
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
                            onClick={() => { /* Add to Cart Logic */ }}
                            sx={{ bgcolor: "#2D333A", color: "#fff", textTransform: "none", fontSize: 16, "&:hover": { bgcolor: "#1f2428" } }}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => handleToggleSave(item._id)}
                            sx={{ bgcolor: "#2D333A", color: "#fff", textTransform: "none", fontSize: 16, "&:hover": { bgcolor: "#1f2428" } }}
                          >
                            {isSaved ? "Unsave" : "Save"}
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  );
                })}
              </Box>

              <ArrowForwardIosIcon onClick={() => handleScroll(groupName, "right")} sx={{ cursor: "pointer" }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

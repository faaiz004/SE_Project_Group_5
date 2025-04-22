import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchOutfits } from "../../pages/ExplorePage/constants";
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

  // Simple left/right scroll handler
  const handleScroll = (groupName, direction) => {
    const container = scrollContainerRefs.current[groupName];
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // --- SKELETON LOADER ---
  if (isLoading) {
    const skeletonCategories = [0, 1]; // show two groups
    return (
      <Box sx={root}>
        {skeletonCategories.map((_, idx) => (
          <Box
            key={idx}
            sx={{
              width: "90%",
              maxWidth: 1200,
              mb: 4,
              mx: "auto",
              outline: "none",
            }}
          >
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 4, px: 2 }}>
              {[...Array(4)].map((__, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width="22%"
                  height={280}
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

  // Group by “category - Uppers/Lowers”
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
        // de-duplicate by name
        const uniqueOutfits = outfits.filter(
          (item, idx, self) =>
            idx === self.findIndex((i) => i.name === item.name)
        );

        // Build a nicer label
        const first = uniqueOutfits[0] || {};
        const prefixMap = {
          SF_BL: "Blazers",
          SF_DS: "Dress Shirts",
          SF_JN: "Jeans",
          SF_PT: "Pants / Trousers",
          SF_PS: "Polo Shirts",
          SF_SR: "Shorts",
          SF_TS: "T - Shirts",
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
          <Box
            key={groupName}
            tabIndex={0}
            sx={{
              width: "90%",
              maxWidth: 1200,
              mb: 4,
              mx: "auto",
              outline: "none",
            }}
          >
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
              <IconButton onClick={() => handleScroll(groupName, "left")}>
                <ArrowBackIosNewIcon />
              </IconButton>

              <Box
                ref={(el) => (scrollContainerRefs.current[groupName] = el)}
                sx={{
                  display: "flex",
                  flex: 1,
                  gap: 4,
                  overflow: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  px: 2,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {uniqueOutfits.map((item) => {
                  // FALLBACK to imageUrl if there's no signedImageUrl
                  const rawUrl = item.signedImageUrl || item.imageUrl || "";
                  const imageUrl = rawUrl.replace(
                    "/thumbnails/thumbnails/",
                    "/thumbnails/"
                  );
                  console.log("corrected imageUrl:", imageUrl);

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
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 3,
                          backgroundColor: "black",
                          height: "100%",
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.05)", zIndex: 1 },
                        }}
                        onClick={() => navigate("/mannequin")}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={imageUrl}
                          alt={item.category}
                          imgProps={{ loading: "lazy" }}
                          sx={{
                            backgroundColor: "white",
                            objectFit: "contain",
                          }}
                        />
                      </Card>
                    </Box>
                  );
                })}
              </Box>

              <IconButton onClick={() => handleScroll(groupName, "right")}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

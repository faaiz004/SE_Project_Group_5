import React, { useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
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

  const handleScroll = (groupName, direction) => {
    const container = scrollContainerRefs.current[groupName];
    if (!container) return;
    const amount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    const skeletonCategories = [0, 1];
    return (
      <Box sx={root}>
        {skeletonCategories.map((_, idx) => (
          <Box key={idx} sx={{ width: "90%", maxWidth: 1200, mb: 4, mx: "auto" }}>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 4, px: 2 }}>
              {[...Array(4)].map((__, i) => (
                <Skeleton
                  key={i}
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

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  // Group outfits into "Category – Uppers/Lowers"
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
        const unique = outfits.filter(
          (o, i, arr) => arr.findIndex((x) => x.name === o.name) === i
        );

        // Build a human-friendly label
        const first = unique[0] || {};
        const prefixMap = {
          SF_BL: "Blazers",
          SF_DS: "Dress Shirts",
          SF_JN: "Jeans",
          SF_PT: "Pants / Trousers",
          SF_PS: "Polo Shirts",
          SF_SR: "Shorts",
          SF_TS: "T‑Shirts",
        };
        let label = first.category || "";
        for (const pre in prefixMap) {
          if (first.name?.startsWith(pre)) {
            label = `${prefixMap[pre]} - ${first.upper ? "Uppers" : "Lowers"}`;
            break;
          }
        }

        return (
          <Box
            key={groupName}
            tabIndex={0}
            sx={{ width: "90%", maxWidth: 1200, mb: 4, mx: "auto" }}
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
              <ArrowBackIosNewIcon
                onClick={() => handleScroll(groupName, "left")}
                sx={{ cursor: "pointer" }}
              />

              <Box
                ref={(el) => (scrollContainerRefs.current[groupName] = el)}
                sx={{
                  display: "flex",
                  flex: 1,
                  gap: 4,
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  px: 2,
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {unique.map((item) => {
                  // fix double‑thumbnails in URL
                  const raw = item.signedImageUrl || item.imageUrl || "";
                  const imageUrl = raw.replace(
                    "/thumbnails/thumbnails/",
                    "/thumbnails/"
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
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.05)", zIndex: 1 },
                        }}
                      >
                        {/* image with padding around */}
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

                        {/* always‑visible button strip */}
                        <Box sx={{ px: 1, py: 1, display: "flex", gap: 1 }}>
                          <Button
                            fullWidth
                            onClick={() => {
                              /* addToCart logic */
                            }}
                            sx={{
                              bgcolor: "#2D333A",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: 16,
                              "&:hover": { bgcolor: "#1f2428" },
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => navigate(`/clothes/${item._id}`)}
                            sx={{
                              bgcolor: "#2D333A",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: 16,
                              "&:hover": { bgcolor: "#1f2428" },
                            }}
                          >
                            Save
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

import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchOutfits } from "../../pages/ExplorePage/constants";

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

  // Create refs to store scroll containers
  const scrollContainerRefs = useRef({});

  // Better trackpad scrolling implementation
  useEffect(() => {
    const containers = scrollContainerRefs.current;
    const eventListeners = [];

    // Process each container
    Object.entries(containers).forEach(([category, container]) => {
      if (!container) return;

      // Function that handles both trackpad and mouse wheel
      const handleScroll = (event) => {
        // For trackpads, we want both horizontal and vertical gestures to work
        const scrollX = Math.abs(event.deltaX);
        const scrollY = Math.abs(event.deltaY);

        // If this is primarily a horizontal scroll, let the browser handle it
        if (scrollX > scrollY && scrollX > 0) return;

        // Otherwise, convert vertical scrolling to horizontal
        event.preventDefault();

        // Netflix-like smooth scrolling - adjust scrollAmount for right feel
        const direction = event.deltaY > 0 ? 1 : -1;
        const scrollAmount = direction * Math.min(Math.abs(event.deltaY) * 2.5, 250);

        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      };

      // Add the event listener
      container.addEventListener('wheel', handleScroll, { passive: false });

      // Store the listener details for cleanup
      eventListeners.push({ container, handler: handleScroll });
    });

    // Cleanup function that removes all event listeners
    return () => {
      eventListeners.forEach(({ container, handler }) => {
        container.removeEventListener('wheel', handler);
      });
    };
  }, [data]); // Re-establish listeners when data changes

  if (isLoading) return <Typography>Loading outfits...</Typography>;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  // Minimal addition: classify each outfit as either Upper or Lower.
  const categoriesMap = data.reduce((acc, outfit) => {

    console.log(outfit)
    const outfitType = outfit.upper === true ? "Upper" : "Lower";
    const key = `${outfit.category} - ${outfitType}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(outfit);
    return acc;
  }, {});
  const categoriesArr = Object.entries(categoriesMap);
  

  // Handle arrow button clicks
  const handleScroll = (category, direction) => {
    const container = scrollContainerRefs.current[category];
    if (container) {
      // Netflix-like scrolling - show more items at once
      const scrollAmount = container.clientWidth * 0.75; // 75% of container width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={root}>
      {categoriesArr.map(([groupName, outfits]) => {
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
                fontFamily: "Inter, sans-serif",
                mb: 2,
              }}
            >
              {groupName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => handleScroll(groupName, 'left')}>
                <ArrowBackIosNewIcon />
              </IconButton>

              {/* Horizontal scrollable container */}
              <Box
                ref={el => scrollContainerRefs.current[groupName] = el}
                sx={{
                  display: "flex",
                  flex: 1,
                  gap: 4,
                  overflow: "auto", // Supports native scrolling
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  px: 2,
                  WebkitOverflowScrolling: "touch", // Smooth iOS scrolling
                }}
              >
                {outfits.map((item) => (
                  <Box
                    key={item.id}
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
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          zIndex: 1,
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="250"
                        image={item.signedImageUrl}
                        alt={item.category}
                      />
                    </Card>
                  </Box>
                ))}
              </Box>

              <IconButton onClick={() => handleScroll(groupName, 'right')}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

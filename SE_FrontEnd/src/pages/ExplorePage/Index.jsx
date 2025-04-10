import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  GroupAdd,
  ShoppingCart,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ClothesBox, HeaderBox, ImageBox, root, SearchBox } from "./Styles";
import SearchBar from "../../Layouts/ExplorePage/SearchBar";
import ExploreClothes from "../../Layouts/ExplorePage/ExploreClothes";

const ExplorePage = () => {
  const navigate = useNavigate();
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // We will add our cart logic over here
  };

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
                  onClick={() =>
                    window.open("https://www.instagram.com", "_blank")
                  }
                />
                <Twitter
                  sx={{ color: "white", fontSize: 30, cursor: "pointer" }}
                  onClick={() =>
                    window.open("https://www.twitter.com", "_blank")
                  }
                />
                <Facebook
                  sx={{ color: "white", fontSize: 30, cursor: "pointer" }}
                  onClick={() =>
                    window.open("https://www.facebook.com", "_blank")
                  }
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
              <ShoppingCart sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
            <IconButton>
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
  );
};

export default ExplorePage;

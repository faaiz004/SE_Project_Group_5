import React from "react";
import { Box, InputBase, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const categories = ["Modern", "Formal", "Western", "Vintage", "Old Money"];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "50px",
          px: 2,
          py: 1,
          width: { xs: "90%", sm: "80%", md: "70%" },
          backdropFilter: "blur(6px)",
          
        }}
      >
        <MenuIcon sx={{ color: "#fff", mr: 1 }} />
        <InputBase
          placeholder="Hinted search text"
          sx={{ flex: 1, color: "white" }}
        />
        <IconButton>
          <SearchIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      {/* Categories */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <Typography key={cat} variant="body2" sx={{ color: "#fff", fontSize: "16px" }}>
            {cat}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default SearchBar;
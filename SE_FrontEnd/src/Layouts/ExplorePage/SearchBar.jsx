import React, { useState } from "react";
import { Box, InputBase, IconButton, Paper, List, ListItemButton, ListItemText, ClickAwayListener } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const categories = ["Modern", "Formal", "Western", "Vintage", "Old Money"];
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <ClickAwayListener onClickAway={() => setFocused(false)}>
        <Box
          sx={{
            width: focused 
              ? { xs: "95%", sm: "90%", md: "650px" } 
              : { xs: "90%", sm: "80%", md: "500px" },
            maxWidth: "100%",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          {/* Search Bar */}
          <Box
            onClick={() => setFocused(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: focused ? "30px" : "50px",
              px: 3,
              py: focused ? 2 : 1,
              backdropFilter: "blur(6px)",
              cursor: "text",
              transition: "all 0.3s ease",
            }}
          >
            <MenuIcon sx={{ color: "#fff", mr: 1 }} />
            <InputBase
              placeholder="Hinted search text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1, color: "white" }}
            />
            <IconButton>
              <SearchIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* Suggestions Dropdown */}
          {focused && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1.5,  // Adds space between search bar and suggestions
                borderRadius: "12px",
                boxShadow: 3,
                bgcolor: "#fff",
                zIndex: 10,
              }}
            >
              <List dense disablePadding>
                {categories
                  .filter((cat) =>
                    cat.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((cat) => (
                    <ListItemButton
                      key={cat}
                      onClick={() => {
                        setQuery(cat);
                        setFocused(false);
                      }}
                    >
                      <ListItemText primary={cat} />
                    </ListItemButton>
                  ))}
              </List>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default SearchBar;


import React, { useState } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  const hardcodedSuggestions = ["Wedding", "Formal event", "Casual hangout"];

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a clothes‐query parser. Below is the Mongoose schema for our “clothes” collection: const clothesSchema = new mongoose.Schema({ name: String, brand: String, size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, category: { type: String, enum: ['Modern','Modern/Old_Money','Smart_Casual/Casual_Everyday','Smart_Casual','Casual_Everyday'] }, price: Number, upper: Boolean, lower: Boolean, imageUrl: String }); When I give you a user’s free‐text request, output exactly three comma-separated tokens with no extra text or line breaks in the form <Category>,<min>-<max>,<upper|lower|both>, where Category is one of the five enum values above, price range defaults to 0-9999 if unspecified, and scope defaults to both if no piece type is mentioned. Examples: for “wedding dress for beach ceremony” output Modern,100-500,both; for “cheap t-shirts under $30” output Casual_Everyday,0-30,upper; for “black jeans” output Modern/Old_Money,0-9999,lower. User query: ${input}`,
          parameters: { max_new_tokens: 16 }
        }),
      });

      const data = await response.json();
      const parsed = data?.[0]?.generated_text?.trim();

      if (parsed) {
        const [category, priceRange, scope] = parsed.split(",");
        setSuggestions([`Category: ${category}`, `Price: ${priceRange}`, `Part: ${scope}`]);
        console.log("Parsed values:", { category, priceRange, scope });
      } else {
        setSuggestions(["No response from model."]);
      }
    } catch (error) {
      console.error("Error fetching from Hugging Face:", error);
      setSuggestions(["Failed to fetch suggestions."]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    fetchSuggestions(input);
  };

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
            <InputBase
              placeholder="Ask for outfit suggestions..."
              value={query}
              onChange={handleInputChange}
              autoComplete="on"
              sx={{ flex: 1, color: "white" }}
            />
            <IconButton>
              <SearchIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {focused && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1.5,
                borderRadius: "12px",
                boxShadow: 3,
                bgcolor: "#fff",
                zIndex: 10,
              }}
            >
              {loading ? (
                <ListItemText primary="Loading suggestions..." sx={{ px: 2, py: 1 }} />
              ) : query.trim() === "" ? (
                <List dense disablePadding>
                  {hardcodedSuggestions.map((item, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => {
                        setQuery(item);
                        fetchSuggestions(item);
                        setFocused(false);
                      }}
                    >
                      <ListItemText primary={item} />
                    </ListItemButton>
                  ))}
                </List>
              ) : suggestions.length > 0 ? (
                <List dense disablePadding>
                  {suggestions.map((suggestion, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => {
                        setQuery(suggestion);
                        setFocused(false);
                      }}
                    >
                      <ListItemText primary={suggestion} />
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <ListItemText primary="No suggestions found." sx={{ px: 2, py: 1 }} />
              )}
            </Paper>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default SearchBar;
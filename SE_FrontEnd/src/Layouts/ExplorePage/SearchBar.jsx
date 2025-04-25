import React, { useState } from "react";
import {
  Box, InputBase, IconButton, Paper,
  List, ListItemButton, ListItemText, ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const hardcodedSuggestions = ["Wedding", "Formal event", "Casual hangout"];

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (input) => {
    if (!input.trim()) { 
      setSuggestions([]); 
      return; 
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",   // Use gpt-4o or gpt-3.5-turbo
          messages: [
            {
              role: "system",
              content: `
              You are a clothes‐query parser. Below is the Mongoose schema for our “clothes” collection: const clothesSchema = new mongoose.Schema({ name: String, brand: String, size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, category: { type: String, enum: ['Modern','Modern/Old_Money','Smart_Casual/Casual_Everyday','Smart_Casual','Casual_Everyday'] }, price: Number, upper: Boolean, lower: Boolean, imageUrl: String }); When I give you a user’s free‐text request, output exactly three comma-separated tokens with no extra text or line breaks in the form <Category>,<min>-<max>,<upper|lower|both>.`
            },
            { role: "user", content: input }
          ],
          max_tokens: 16,
          temperature: 0.2
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("OpenAI HTTP", res.status, txt);
        setSuggestions([`API error ${res.status}`]);
        return;
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) { 
        setSuggestions(["No response from model"]); 
        return; 
      }

      const [category, priceRange, scope] = text.split(",");
      setSuggestions([
        `Category: ${category}`,
        `Price: ${priceRange}`,
        `Part: ${scope}`
      ]);
    } catch (err) {
      console.error("OpenAI fetch error:", err);
      setSuggestions(["Failed to fetch suggestions."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <ClickAwayListener onClickAway={() => setFocused(false)}>
        <Box sx={{
          width: focused ? { xs: "95%", sm: "90%", md: "650px" }
                         : { xs: "90%", sm: "80%", md: "500px" },
          transition: "all .3s", position: "relative"
        }}>
          <Box onClick={() => setFocused(true)} sx={{
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,.3)",
            borderRadius: focused ? "30px" : "50px",
            px: 3, py: focused ? 2 : 1,
            backdropFilter: "blur(6px)",
            cursor: "text", transition: "all .3s"
          }}>
            <InputBase
              placeholder="Ask for outfit suggestions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchSuggestions(query);
                  setFocused(false);
                }
              }}
              sx={{ flex: 1, color: "#fff" }}
            />
            <IconButton onClick={() => { fetchSuggestions(query); setFocused(false); }}>
              <SearchIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {focused && (
            <Paper sx={{
              position: "absolute", top: "100%", left: 0, right: 0, mt: 1.5,
              borderRadius: 2, boxShadow: 3, zIndex: 10
            }}>
              {loading ? (
                <ListItemText primary="Loading suggestions..." sx={{ px: 2, py: 1 }} />
              ) : query.trim() === "" ? (
                <List dense disablePadding>
                  {hardcodedSuggestions.map((s, i) => (
                    <ListItemButton key={i} onClick={() => {
                      setQuery(s); 
                      fetchSuggestions(s); 
                      setFocused(false);
                    }}>
                      <ListItemText primary={s} />
                    </ListItemButton>
                  ))}
                </List>
              ) : suggestions.length ? (
                <List dense disablePadding>
                  {suggestions.map((s, i) => (
                    <ListItemButton key={i} onClick={() => { setQuery(s); setFocused(false); }}>
                      <ListItemText primary={s} />
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

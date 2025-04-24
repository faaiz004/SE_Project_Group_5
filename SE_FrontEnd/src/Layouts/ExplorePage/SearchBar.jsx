import React, { useState } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `
              You are a clothes‐query parser. Below is the Mongoose schema for our “clothes” collection: const clothesSchema = new mongoose.Schema({ name: String, brand: String, size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, category: { type: String, enum: ['Modern','Modern/Old_Money','Smart_Casual/Casual_Everyday','Smart_Casual','Casual_Everyday'] }, price: Number, upper: Boolean, lower: Boolean, imageUrl: String }); When I give you a user’s free‐text request, output exactly three comma-separated tokens with no extra text or line breaks in the form <Category>,<min>-<max>,<upper|lower|both>.`,
            },
            {
              role: "user",
              content: query,
            },
          ],
          max_tokens: 16,
          temperature: 0.2,
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) return;

      const [category, priceRange, part] = text.split(",");
      const params = new URLSearchParams({
        category,
        price: priceRange,
        part,
      });

      navigate(`/all-clothes-search?${params.toString()}`);
      setFocused(false);
    } catch (err) {
      console.error("Error during search:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <Paper
        component="form"
        sx={{
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          width: 400,
          borderRadius: 2,
          boxShadow: focused ? 3 : 1,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for clothes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <IconButton onClick={handleSearch} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : <SearchIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
}









// import React, { useState } from "react";
// import {
//   Box, InputBase, IconButton, Paper,
//   List, ListItemButton, ListItemText, ClickAwayListener,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";

// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// const hardcodedSuggestions = ["Wedding", "Formal event", "Casual hangout"];

// const SearchBar = () => {
//   const [focused, setFocused] = useState(false);
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [category, setCategory] = useState("");
//   const [priceRange, setPriceRange] = useState("");
//   const [scope, setScope] = useState("");
//   const navigate = useNavigate();

//   const fetchSuggestions = async (input) => {
//     if (!input.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           messages: [
//             {
//               role: "system",
//               content: `
//               You are a clothes‐query parser. Below is the Mongoose schema for our “clothes” collection: const clothesSchema = new mongoose.Schema({ name: String, brand: String, size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, category: { type: String, enum: ['Modern','Modern/Old_Money','Smart_Casual/Casual_Everyday','Smart_Casual','Casual_Everyday'] }, price: Number, upper: Boolean, lower: Boolean, imageUrl: String }); When I give you a user’s free‐text request, output exactly three comma-separated tokens with no extra text or line breaks in the form <Category>,<min>-<max>,<upper|lower|both>.
//               `
//             },
//             { role: "user", content: input }
//           ],
//           max_tokens: 16,
//           temperature: 0.2
//         })
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         console.error("OpenAI HTTP", res.status, txt);
//         setSuggestions([`API error ${res.status}`]);
//         return;
//       }

//       const data = await res.json();
//       const text = data.choices?.[0]?.message?.content?.trim();
//       if (!text) {
//         setSuggestions(["No response from model"]);
//         return;
//       }

//       const [category, priceRange, scope] = text.split(",");
//       setCategory(category);
//       setPriceRange(priceRange);
//       setScope(scope);
//       setSuggestions([
//         `Category: ${category}`,
//         `Price: ${priceRange}`,
//         `Part: ${scope}`
//       ]);
//     } catch (err) {
//       console.error("OpenAI fetch error:", err);
//       setSuggestions(["Failed to fetch suggestions."]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     // Construct the search URL with category, price, and scope
//     const queryParams = new URLSearchParams({
//       query, category, priceRange, scope
//     }).toString();
//     navigate(`/all-clothes-search?${queryParams}`);
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
//       <ClickAwayListener onClickAway={() => setFocused(false)}>
//         <Box sx={{
//           width: focused ? { xs: "95%", sm: "90%", md: "650px" }
//                          : { xs: "90%", sm: "80%", md: "500px" },
//           transition: "all .3s", position: "relative"
//         }}>
//           <Box onClick={() => setFocused(true)} sx={{
//             display: "flex", alignItems: "center",
//             background: "rgba(255,255,255,.3)",
//             borderRadius: focused ? "30px" : "50px",
//             px: 3, py: focused ? 2 : 1,
//             backdropFilter: "blur(6px)",
//             cursor: "text", transition: "all .3s"
//           }}>
//             <InputBase
//               placeholder="Ask for outfit suggestions..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   fetchSuggestions(query);
//                   handleSearch();
//                   setFocused(false);
//                 }
//               }}
//               sx={{ flex: 1, color: "#fff" }}
//             />
//             <IconButton onClick={() => { fetchSuggestions(query); handleSearch(); setFocused(false); }}>
//               <SearchIcon sx={{ color: "#fff" }} />
//             </IconButton>
//           </Box>

//           {focused && (
//             <Paper sx={{
//               position: "absolute", top: "100%", left: 0, right: 0, mt: 1.5,
//               borderRadius: 2, boxShadow: 3, zIndex: 10
//             }}>
//               {loading ? (
//                 <ListItemText primary="Loading suggestions..." sx={{ px: 2, py: 1 }} />
//               ) : query.trim() === "" ? (
//                 <List dense disablePadding>
//                   {hardcodedSuggestions.map((s, i) => (
//                     <ListItemButton key={i} onClick={() => {
//                       setQuery(s); 
//                       fetchSuggestions(s); 
//                       setFocused(false);
//                     }}>
//                       <ListItemText primary={s} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               ) : suggestions.length ? (
//                 <List dense disablePadding>
//                   {suggestions.map((s, i) => (
//                     <ListItemButton key={i} onClick={() => { setQuery(s); setFocused(false); }}>
//                       <ListItemText primary={s} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               ) : (
//                 <ListItemText primary="No suggestions found." sx={{ px: 2, py: 1 }} />
//               )}
//             </Paper>
//           )}
//         </Box>
//       </ClickAwayListener>
//     </Box>
//   );
// };

// export default SearchBar;

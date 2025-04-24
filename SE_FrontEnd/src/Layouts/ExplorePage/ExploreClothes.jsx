// src/components/ExploreClothes.jsx

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  Skeleton
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchOutfits } from "../../pages/ExplorePage/constants";
import {
  saveClothes,
  unsaveClothes,
  getSavedClothes
} from "../../services/S_U_Posts/Index";
import { getUserPreferences } from "../../services/FetchPreferences";
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
  const navigate = useNavigate();
  const scrollContainerRefs = useRef({});
  const [savedStates, setSavedStates] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const {
    data: outfits,
    isLoading: outfitsLoading,
    isError: outfitsError,
    error: outfitsErr
  } = useQuery({
    queryKey: ["outfits"],
    queryFn: fetchOutfits
  });

  const {
    data: prefResp,
    isLoading: prefLoading,
    isError: prefError,
    error: prefErr
  } = useQuery({
    queryKey: ["preferences"],
    queryFn: getUserPreferences
  });

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(stored);

    (async () => {
      try {
        const saved = await getSavedClothes();
        const init = {};
        saved.forEach((c) => { init[c._id] = true; });
        setSavedStates(init);
      } catch (e) {
        console.error("Failed to fetch saved clothes:", e);
      }
    })();
  }, []);

  const saveMutation = useMutation({
    mutationFn: saveClothes,
    onError: (_, id) => setSavedStates(s => ({ ...s, [id]: false }))
  });
  const unsaveMutation = useMutation({
    mutationFn: unsaveClothes,
    onError: (_, id) => setSavedStates(s => ({ ...s, [id]: true }))
  });

  const handleToggleSave = (id) => {
    const was = savedStates[id] || false;
    setSavedStates(s => ({ ...s, [id]: !was }));
    was ? unsaveMutation.mutate(id) : saveMutation.mutate(id);
  };

  const handleAddToCart = (item, imageUrl) => {
    if (cartItems.some(ci => ci.productId === item._id)) return;
    const entry = {
      productId: item._id,
      name: item.name,
      brand: item.brand,
      size: item.size,
      category: item.category,
      price: item.price,
      imageUrl,
      quantity: 1,
    };
    const updated = [...cartItems, entry];
    sessionStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const handleScroll = (key, dir) => {
    const el = scrollContainerRefs.current[key];
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (outfitsLoading || prefLoading) {
    return (
      <Box sx={root}>
        {[0,1].map(i=>(
          <Box key={i} sx={{ width:"90%", maxWidth:1200, mb:4 }}>
            <Skeleton variant="text" width={200} height={32} sx={{ mb:2 }}/>
            <Box sx={{ display:"flex", gap:4 }}>
              {[...Array(4)].map((_,j)=>(
                <Skeleton key={j} variant="rectangular" width="22%" height={320} sx={{ borderRadius:2 }}/>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
// ...existing code...

if (outfitsError) return <Typography>Error: {outfitsErr.message}</Typography>;
if (prefError)    return <Typography>Error: {prefErr.message}</Typography>;

// Map user sizes to clothing sizes
const sizeMap = { small: 'S', medium: 'M', large: 'L' };

// Style preference mapping
const styleMatchMap = {
  Casual: ['Casual_Everyday',  'Smart_Casual'],
  business: ['Modern'],
  modern: ['Modern'],
  oldmoney: ['Modern/Old_Money']
};

// ...existing code...

const { shirtSize, pantSize, stylePreference, gender: userGender } = prefResp.preferences;
const shirtMapped = sizeMap[shirtSize];
const pantMapped = sizeMap[pantSize];

// Get matching style categories based on user preference
const matchingStyles = styleMatchMap[stylePreference] || [];

// console.log(matchingStyles);

// Filter by size and style preferences
const matchedOutfits = outfits.filter(o => {
  // Size match check
  const sizeMatches = o.upper ? o.size === shirtMapped : o.size === pantMapped;

  console.log(o.category)
  
  // Style match check - if no style preference or no matching styles, don't filter by style
  const styleMatches = !stylePreference || matchingStyles.length === 0 || 
                     (o.category && matchingStyles.includes(o.category));

  const genderMatches = o.gender === 'Unisex'
  || o.gender === userGender;

  console.log(o)
  
  return sizeMatches && styleMatches && genderMatches;
});

// Remove duplicates by name AND size combinations
const nameSizeMap = new Map();
const forYou = matchedOutfits.filter(item => {
  // Create a composite key using name and size
  const key = `${item.name}-${item.size}`;
  
  // If this name+size combination already exists, filter it out
  if (nameSizeMap.has(key)) {
    return false;
  }
  
  // Otherwise, keep it and mark this name+size as seen
  nameSizeMap.set(key, true);
  return true;
});

const categoriesMap = outfits.reduce((acc,o)=>{
  const key = `${o.category} - ${o.upper ? "Uppers" : "Lowers"}`;
  (acc[key] = acc[key]||[]).push(o);
  return acc;
}, {});

// ...existing code...

// ...existing code...
  const categories = Object.entries(categoriesMap);

  const renderCard = item => {
    const raw = item.signedImageUrl || item.imageUrl || "";
    const imageUrl = raw.replace("/thumbnails/thumbnails/","/thumbnails/");
    const isSaved = !!savedStates[item._id];
    const isInCart = cartItems.some(ci => ci.productId === item._id);

    return (
      <Box key={item._id} sx={{ flex:"0 0 auto", width:{xs:"85%",sm:"40%",md:"22%"}, minWidth:200 }}>
        <Card sx={{
          display:"flex", flexDirection:"column",
          borderRadius:2, overflow:"hidden", boxShadow:3, bgcolor:"#fff",
          transition:"transform 0.3s","&:hover":{transform:"scale(1.05)",zIndex:1}
        }}>
          <Box sx={{ px:1, pt:1 }}>
            <CardMedia
              component="img"
              src={imageUrl}
              alt={item.category}
              height="260"
              imgProps={{ loading:"lazy" }}
              sx={{ objectFit:"contain" }}
              onClick={()=>navigate("/mannequin")}
            />
          </Box>
          <Box sx={{ px:1, py:1, display:"flex", gap:1 }}>
            <Button
              fullWidth
              onClick={()=>handleAddToCart(item,imageUrl)}
              disabled={isInCart}
              sx={{
                bgcolor:"#2D333A", color:"#fff", textTransform:"none", fontSize:16,
                "&:hover":{bgcolor:"#1f2428"},
                "&.Mui-disabled":{bgcolor:"#2D333A",color:"#fff"}
              }}
            >
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
            <Button
              fullWidth
              onClick={()=>handleToggleSave(item._id)}
              sx={{
                bgcolor:"#2D333A", color:"#fff", textTransform:"none", fontSize:16,
                "&:hover":{bgcolor:"#1f2428"}
              }}
            >
              {isSaved ? "Unsave" : "Save"}
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  return (
    <Box sx={root}>

      {/* For You ❤️ */}
      <Box sx={{ width:"90%", maxWidth:1200, mb:6 }}>
        <Typography sx={{ fontSize:28, fontWeight:600, color:"#27374D", mb:2 }}>
          For You ❤️
        </Typography>
        <Box sx={{ display:"flex", alignItems:"center" }}>
          <ArrowBackIosNewIcon onClick={()=>handleScroll("forYou","left")} sx={{ cursor:"pointer" }}/>
          <Box
            ref={el=>scrollContainerRefs.current["forYou"]=el}
            sx={{
              display:"flex", flex:1, gap:4, overflowX:"auto", px:2,
              "&::-webkit-scrollbar":{display:"none"}
            }}
          >
            {forYou.length > 0
              ? forYou.map(renderCard)
              : <Typography>No items match your preferences.</Typography>
            }
          </Box>
          <ArrowForwardIosIcon onClick={()=>handleScroll("forYou","right")} sx={{ cursor:"pointer" }}/>
        </Box>
      </Box>

      {/* Other categories */}
      {categories.map(([groupName, items]) => {
        const unique = items.filter((o,i,arr)=>arr.findIndex(x=>x.name===o.name)===i);
        const prefixMap = { SF_BL:"Blazers", SF_DS:"Dress Shirts", SF_JN:"Jeans", SF_PT:"Pants / Trousers", SF_PS:"Polo Shirts", SF_SR:"Shorts", SF_TS:"T-Shirts" };
        let label = unique[0]?.category || "";
        for (const pre in prefixMap) {
          if (unique[0]?.name?.startsWith(pre)) {
            label = `${prefixMap[pre]} - ${unique[0].upper ? "Uppers" : "Lowers"}`;
            break;
          }
        }

        return (
          <Box key={groupName} sx={{ width:"90%", maxWidth:1200, mb:4 }}>
            <Typography sx={{ fontSize:28, fontWeight:600, color:"#27374D", mb:2 }}>
              {label}
            </Typography>
            <Box sx={{ display:"flex", alignItems:"center" }}>
              <ArrowBackIosNewIcon onClick={()=>handleScroll(groupName,"left")} sx={{ cursor:"pointer" }}/>
              <Box
                ref={el=>scrollContainerRefs.current[groupName]=el}
                sx={{
                  display:"flex", flex:1, gap:4, overflowX:"auto", px:2,
                  "&::-webkit-scrollbar":{display:"none"}
                }}
              >
                {unique.map(renderCard)}
              </Box>
              <ArrowForwardIosIcon onClick={()=>handleScroll(groupName,"right")} sx={{ cursor:"pointer" }}/>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

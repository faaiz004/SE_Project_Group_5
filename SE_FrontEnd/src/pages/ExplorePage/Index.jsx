import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, GroupAdd, ShoppingCart, Person } from '@mui/icons-material';
import {
    ClothesBox,
    HeaderBox,
    ImageBox,
    root,
    SearchBox
} from './Styles';
import SearchBar from '../../Layouts/ExplorePage/SearchBar';
import ExploreClothes from '../../Layouts/ExplorePage/ExploreClothes';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {  Feed } from '@mui/icons-material'; // Import Feed icon instead of GroupAdd and Person
const ExplorePage = () => {
    const handleAddToCart = (product) => {
        console.log('Adding to cart:', product);
        // Add your cart logic here
    };

    const navigate = useNavigate(); // Initialize useNavigate hook
    
    return (
        <Box sx={root}>
            <Box sx={ImageBox}>
                <Box sx={HeaderBox}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        padding: 2,
                    }}>
                        <Typography sx={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "white",
                        }}>
                            Swipe-Fit
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            gap: 2,
                            marginTop: 2,
                        }}>
                            <Instagram sx={{ color: "white", fontSize: 30, cursor: 'pointer' }} />
                            <Twitter sx={{ color: "white", fontSize: 30, cursor: 'pointer' }} />
                            <Facebook sx={{ color: "white", fontSize: 30, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        marginTop: 2,
                    }}>
                    <IconButton onClick={() => navigate("/stylefeed")}>
                    <Feed sx={{ color: "white", fontSize: 30 }} /> {/* Using Feed icon for style feed */}
                </IconButton>
                <IconButton onClick={() => navigate("/cart")}>
                    <ShoppingCart sx={{ color: "white", fontSize: 30 }} />
                </IconButton>
                    </Box>
                </Box>
                <Box sx={SearchBox}>
                    <SearchBar />
                </Box>
            </Box>
            <Box sx={ClothesBox}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingY: 4,
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                    gap: 2,
                }}>
                    <Typography sx={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: "#27374D",
                    }}>
                        Explore Trending Searches
                    </Typography>
                    <Typography sx={{
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#27374D",
                    }}>
                        Shop, Vibe, and Relax
                    </Typography>
                </Box>
                <ExploreClothes onAddToCart={handleAddToCart} />
            </Box>
        </Box>
    );
};

export default ExplorePage;
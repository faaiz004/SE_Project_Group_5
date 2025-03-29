import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; // Import Material-UI icons
import { GroupAdd, ShoppingCart, Person } from '@mui/icons-material';
import { IconButton} from '@mui/material';
import {
    ClothesBox,
    HeaderBox,
    ImageBox,
    root,
    SearchBox
} from './Styles'

import SearchBar from '../../components/ExplorePage/SearchBar';
import ExploreClothes from '../../components/ExplorePage/ExploreClothes';


const ExplorePage = () => {
  return (
    <Box sx={root}>
        <Box sx = {ImageBox}>
            <Box sx = {HeaderBox}>
                <Box sx = {{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: 2,
                }}>
                    <Typography sx = {{
                        fontSize: 40,
                        fontWeight: 700,
                        color: "white",

                    }}>
                        Swipe-Fit
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2, // Adds spacing between icons
                            marginTop: 2, // Adds spacing above the icons
                        }}
                    >
                        <Instagram sx={{ color: "white", fontSize: 30, cursor:'pointer' }} />
                        <Twitter sx={{ color: "white", fontSize: 30, cursor:'pointer' }} />
                        <Facebook sx={{ color: "white", fontSize: 30, cursor: 'pointer' }} />
                    </Box>
                </Box>
                <Box sx = {{
                    display: "flex",
                    gap:1,
                    marginTop: 2,
                }}
                >
                    <IconButton>
                        <GroupAdd sx={{ color: "white", fontSize: 30 }} />
                    </IconButton>
                    <IconButton>
                        <ShoppingCart sx={{ color: "white", fontSize: 30 }} />
                    </IconButton>
                    <IconButton>
                        <Person sx={{ color: "white", fontSize: 30 }} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx = {SearchBox}>
                <SearchBar />
            </Box>
        </Box>
        <Box sx = {ClothesBox}>
            <Box sx = {{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingY: 4,
                width: "100%",
                backgroundColor: "#f0f0f0", // Light gray background
                gap:2,
            }}>
                <Typography sx ={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#27374D",
                }}>

                    Explore Trending Searches
                </Typography>
                <Typography sx = {{
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#27374D",
                }}>
                    Shop, Vibe, and Relax
                </Typography>
            </Box>
            <ExploreClothes />
        </Box>
    </Box>
  );
};

export default ExplorePage;
// Recommendations.jsx
import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

// Replace with your actual image(s)
import sampleImage from "../../assets/StyleFeed/Group.png";

const Recommendations = () => {
  const items = [
    {
      name: "Black Gown",
      price: "4,999",
      color: "Blue",
      size: "M",
      seller: "24/25",
      image: sampleImage,
    },
    {
      name: "Black Gown 2",
      price: "5,500",
      color: "Black",
      size: "L",
      seller: "10/12",
      image: sampleImage,
    }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "80%",
        padding: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Popins, sans-serif",
          fontSize: "20px",
          fontWeight: 400,
          color: "#1E1E1E",
          letterSpacing: "1px", // Add letter spacing (adjust the value as needed)
        }}
      >
        Recommendations for you!
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "#5F65C3", // Light bluish-purple
          marginTop: "-12px", // Pull it closer to the text
        }}
      />

      {items.map((item, idx) => (
        <Card
        variant="outlined"
        elevation={0}
        sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            backgroundColor: "transparent",
            boxShadow: "none",    // No shadow
            borderColor: "transparent", // Removes the outline
            padding: 1
        }}
        >
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            sx={{ width: 170, height: 210, objectFit: "cover" }}
          />
          <CardContent sx={{ padding: "8px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {item.name}
                </Typography>
                <Typography variant="body2">Price: ${item.price}</Typography>
            </Box>
            <Box sx = {{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginTop: 2,
            }}>
                <Typography variant="body2">Color: {item.color}</Typography>
                <Typography variant="body2">Size: {item.size}</Typography>
                <Typography variant="body2">Seller: {item.seller}</Typography>
                <Button variant="contained" sx={{ mt: 1, backgroundColor: 'black', color: 'white' }}>
                Buy Now
                </Button>
            </Box>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Recommendations;

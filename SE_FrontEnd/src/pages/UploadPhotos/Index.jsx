import { useState } from "react";
// Removed Next.js Image import
// import Image from "next/image";
import { 
  Box, 
  Grid, 
  Button, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Checkbox, 
  InputLabel 
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import blue_denim from '../../assets/MannequinPage/blue_denim.jpg';
import red_hoodie from '../../assets/MannequinPage/red_hoodie.jpg';

import { 
  formStyles, 
  gridContainerStyles, 
  leftSectionStyles, 
  rightSectionStyles, 
  imageUploadLabelStyles, 
  imagePreviewContainerStyles, 
  removeButtonStyles, 
  captionSectionStyles, 
  searchContainerStyles, 
  searchInputStyles, 
  scrollAreaStyles, 
  cardStyles, 
  cardContentStyles, 
  noItemsStyles, 
  submitButtonContainerStyles 
} from "./Styles";


const pastPurchases = [
  {
    id: 1,
    name: "Red Hoodie",
    price: "$49.99",
    size: "M",
    color: "Red",
    style: "Casual",
    image: blue_denim,
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: "$59.99",
    size: "32",
    color: "Blue",
    style: "Casual",
    image: red_hoodie,
  },
  {
    id: 3,
    name: "White Sneakers",
    price: "$89.99",
    size: "10",
    color: "White",
    style: "Athletic",
    image: blue_denim,
  },
  {
    id: 4,
    name: "Black T-Shirt",
    price: "$24.99",
    size: "L",
    color: "Black",
    style: "Basic",
    image: red_hoodie,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: "$79.99",
    size: "M",
    color: "Blue",
    style: "Outerwear",
    image: blue_denim,
  },
  {
    id: 6,
    name: "Floral Dress",
    price: "$69.99",
    size: "S",
    color: "Multicolor",
    style: "Formal",
    image: red_hoodie,
  },
];

export default function UploadPhotos() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPurchases = pastPurchases.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.color.toLowerCase().includes(searchLower) ||
      item.style.toLowerCase().includes(searchLower) ||
      item.size.toLowerCase().includes(searchLower)
    );
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      image: selectedImage,
      caption,
      taggedItems: selectedItems,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
      <Grid container sx={gridContainerStyles}>
        {/* Left Section */}
        <Grid item xs={12} lg={6} sx={leftSectionStyles}>
          <Typography sx={{ fontWeight: 400, fontSize: 40, color: '#27374D'  }}>
            Create a New Post
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
            {selectedImage ? (
              <Box sx={{ position: "relative" }}>
                <Box sx={imagePreviewContainerStyles}>
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  sx={removeButtonStyles}
                  onClick={handleRemoveImage}
                >
                  <Close sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            ) : (
              <Box
                component="label"
                htmlFor="image-upload"
                sx={imageUploadLabelStyles}
              >
                <CloudUpload sx={{ fontSize: 40, color: "#6b7280", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#27374D" }}>
                  Upload your image
                </Typography>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Box>
            )}
          </Box>
          <Box sx={captionSectionStyles}>
            <InputLabel htmlFor="caption" sx={{ fontSize: 20, mb: 1, color: "#27374D" }}>
              Caption
            </InputLabel>
            <TextField
              id="caption"
              placeholder="Write a caption for your post..."
              multiline
              minRows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} lg={6} sx={rightSectionStyles}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#27374D" }}>
            Tag Worn Articles
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
            Tag the clothing you're wearing in this image from your past purchases. This helps us understand your style and offer personalized suggestions.
          </Typography>
            <TextField
              type="search"
              placeholder="Search by color, style, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              variant="outlined"
              sx={searchInputStyles}
            />

          <Box sx={scrollAreaStyles}>
            <Box sx={{ display: "flex", gap: 2 }}>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((item) => (
                  <Card
                    key={item.id}
                    sx={cardStyles(selectedItems.includes(item.id))}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <CardContent sx={cardContentStyles}>
                      <Box sx={{ position: "relative", height: "150px", mb: 2 }}>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            {item.price} · Size {item.size}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                            {item.color} · {item.style}
                          </Typography>
                        </Box>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ width: 20, height: 20 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={noItemsStyles}>
                  <Typography>No items match your search. Try different keywords.</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={submitButtonContainerStyles}>
        <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{
            backgroundColor: "#000000",
            color: "#ffffff",
            "&:hover": {
            backgroundColor: "#333333",
            },
        }}
        >
        Create Post
        </Button>
      </Box>
    </Box>
  );
}

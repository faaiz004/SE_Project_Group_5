import { useState } from "react"
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  InputBase
} from "@mui/material"
import { 
  CloudUpload,
  Search,
  Favorite,
  ChatBubbleOutline,
  FilterList
} from "@mui/icons-material"
import CheckIcon from '@mui/icons-material/Check';

import blue_denim from "../../assets/MannequinPage/blue_denim.jpg"
import red_hoodie from "../../assets/MannequinPage/red_hoodie.jpg"
import { red } from "@mui/material/colors";

// Sample data for past purchases
const pastPurchases = [
  {
    id: 1,
    name: "Red Hoodie",
    price: "$49.99",
    size: "M",
    image: blue_denim,
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: "$30.99",
    size: "32",
    image: red_hoodie,
  },
  {
    id: 3,
    name: "White Sneakers",
    price: "$10",
    size: "10",
    image: blue_denim,
  },
  {
    id: 4,
    name: "Black T Shirt",
    price: "$24.99",
    size: "L",
    image: blue_denim,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: "$78.99",
    size: "M",
    image: red_hoodie,
  }
]

export default function CreatePostForm() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState("")
  const [selectedItems, setSelectedItems] = useState([3, 5]) // Pre-select White Sneakers and Denim Jacket
  const [searchTerm, setSearchTerm] = useState("")

  // Filter purchases based on search term
  const filteredPurchases = pastPurchases.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.size.toLowerCase().includes(searchLower) ||
      item.price.toLowerCase().includes(searchLower)
    )
  })

  // Get selected items details
  const selectedItemsDetails = pastPurchases.filter(item => 
    selectedItems.includes(item.id)
  )

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
    }
  }

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log({
      image: selectedImage,
      caption,
      taggedItems: selectedItems,
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ 
      py: 4,
      px: 2,
      backgroundColor: '#f8f8f8',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
        flexWrap: 'nowrap'
      }}>
        {/* Left Section */}
        <Paper sx={{ p: 4, borderRadius: 2, width: '500px', flexShrink: 0 }}>
          <Typography variant="h4" component="h1" align="center" fontWeight="500" gutterBottom sx={{ mb: 4 }}>
            Create a New Post
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              component="label"
              htmlFor="image-upload"
              sx={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              {selectedImage ? (
                <Box 
                  component="img"
                  src={selectedImage}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 28, color: '#666', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Upload your image
                  </Typography>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Caption
            </Typography>
            <TextField
              fullWidth
              placeholder="Write a caption for your post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Tag Worn Articles
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Tag the clothing you're wearing in this image from your past purchases. 
              This helps us understand your style and offer personalized suggestions.
            </Typography>
            
            <Box sx={{ 
              position: 'relative',
              mb: 3
            }}>
              <InputBase
                fullWidth
                placeholder="Search by color, style, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 1,
                  pl: 4
                }}
              />
              <Search sx={{ 
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {filteredPurchases.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    width: 100,
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: 100,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    mb: 1
                  }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {selectedItems.includes(item.id) && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#1976d2',
                        borderRadius: '0 0 0 8px',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.size}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Right Section - Post Preview */}
        <Paper sx={{ p: 4, borderRadius: 2, width: '500px', flexShrink: 0 }}>
          <Typography variant="h4" component="h2" align="center" fontWeight="500" gutterBottom>
            Post Preview
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            This is how your post will appear in the feed.
          </Typography>
          
          <Paper 
            elevation={1} 
            sx={{ 
              maxWidth: 500, 
              mx: 'auto', 
              borderRadius: 2, 
              overflow: 'hidden',
              border: '1px solid #eee'
            }}
          >
            {/* Post Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: '#f0f0f0' }}>
                <Box 
                  component="img"
                  src="/placeholder.svg?height=40&width=40&text=U"
                  alt="User"
                  sx={{ width: '100%', height: '100%' }}
                />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  username
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Just now
                </Typography>
              </Box>
            </Box>
            
            {/* Post Image */}
            <Box 
              component="img"
              src={selectedImage || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-03%20at%205.24.38%E2%80%AFPM-b257J6hrtziaTKbIaPYg6tMJtI0C4u.png"}
              alt="Post image"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            
            {/* Post Actions */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ p: 0 }}>
                <Favorite sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton sx={{ p: 0, ml: 1 }}>
                <ChatBubbleOutline sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton sx={{ p: 0, ml: 1 }}>
                <FilterList sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
            
            {/* Post Caption */}
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Your captson
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {caption || "Your caption will appear here..."}
              </Typography>
            </Box>
            
            {/* Tagged Items */}
            <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedItemsDetails.map(item => (
                <Chip 
                  key={item.id} 
                  label={`${item.name} (${item.size})`} 
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          </Paper>

          <Box sx={{ mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              size="large"
              sx={{ 
                py: 1.5, 
                backgroundColor: '#1a2027',
                '&:hover': {
                  backgroundColor: '#2c3540'
                },
                borderRadius: 1
              }}
            >
              Create Post
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

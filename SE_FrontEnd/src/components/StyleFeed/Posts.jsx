// Posts.jsx
import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Use your own images or placeholders
import sampleImage from '../../assets/StyleFeed/Group.png';

const Posts = () => {
  // 1) Array of multiple posts
  const postData = [
    {
      id: 1,
      name: 'Ashlyn Taylor',
      avatar: sampleImage,
      postImage: sampleImage,
      likes: 1234,
      price: 129.0,
    },
    {
      id: 2,
      name: 'John Doe',
      avatar: sampleImage,
      postImage: sampleImage,
      likes: 567,
      price: 99.0,
    },
    {
      id: 3,
      name: 'Jane Smith',
      avatar: sampleImage,
      postImage: sampleImage,
      likes: 890,
      price: 159.0,
    },
    // Add more posts as needed...
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '500px',
        height: 'calc(100vh - 120px)',
        overflowY: 'auto',
        /* Hide scrollbar for Chrome, Safari and Opera */
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        /* Hide scrollbar for Firefox */
        scrollbarWidth: 'none',
        paddingRight: 2, 
        /* Optional: add right padding to avoid scrollbar overlap */
      }}
    >
      {/* 2) Map over posts to create multiple cards */}
      {postData.map((post) => (
        <Card
          key={post.id}
          sx={{
            borderRadius: 5,
            boxShadow: 2,
            marginBottom: 3, // spacing between cards
          }}
        >
          <CardHeader
            avatar={<Avatar alt={post.name} src={post.avatar} />}
            title={
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#000',
                }}
              >
                {post.name}
              </Typography>
            }
          />

          <CardMedia
            component="img"
            image={post.postImage}
            alt={post.name}
            sx={{
              width: '100%',
              height: 450,
              objectFit: 'cover',
            }}
          />

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton>
                  <FavoriteBorderIcon />
                </IconButton>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  {post.likes.toLocaleString()} Likes
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#000',
                  marginRight: 2,
                }}
              >
                ${post.price.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '12px',
                paddingX: '32px',
                paddingY: '10px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#333',
                  boxShadow: 'none',
                },
              }}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Posts;

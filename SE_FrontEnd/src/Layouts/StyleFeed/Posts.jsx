// Layouts/StyleFeed/Posts.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { getPosts } from '../../api/postService';

const Posts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <Typography>Loading posts...</Typography>;
  }
  if (error) {
    return <Typography color="error">Error fetching posts: {error.message}</Typography>;
  }

  const posts = data?.posts || [];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '500px',
        height: 'calc(100vh - 120px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        paddingRight: 2,
      }}
    >
      {/* This displays posts */}
      {posts.map((post) => (
        <Card
          key={post._id}
          sx={{
            borderRadius: 5,
            boxShadow: 2,
            marginBottom: 3,
          }}
        >
          <CardHeader
            avatar={
              <Avatar alt={post.user?.username || post.user?.email || "User"} src={post.user?.avatar || undefined} />
            }
            title={
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#000',
                }}
              >
                {post.user?.username || post.user?.email || "Unknown"}
              </Typography>
            }
          />

          <CardMedia
            component="img"
            image={post.signedImageUrl}
            alt={post.caption}
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
                  {post.likes ? post.likes.toLocaleString() : "0"} Likes
                </Typography>
              </Box>
              {/* Dummy Price */}
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#000',
                  marginRight: 2,
                }}
              >
                $123.45
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
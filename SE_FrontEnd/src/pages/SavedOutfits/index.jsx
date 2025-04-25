import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {fetchSaved} from '../../api/postService';

export default function SavedOutfits() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSaved(token).then(r => setPosts(r.data.posts));
  }, []);

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h4" mb={2}>Saved Outfits</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          overflowX: 'auto'
        }}
      >
        {posts.map(post => (
          <Box key={post._id} sx={{ border:'1px solid #ddd', p:1 }}>
            <img src={post.signedImageUrl} alt="" style={{ width:'100%' }} />
            <Typography variant="body2">by {post.user.username}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

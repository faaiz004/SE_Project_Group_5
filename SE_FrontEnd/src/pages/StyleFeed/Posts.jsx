import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteBorder  from '@mui/icons-material/FavoriteBorder';
import Favorite        from '@mui/icons-material/Favorite';
import BookmarkBorder  from '@mui/icons-material/BookmarkBorder';
import Bookmark        from '@mui/icons-material/Bookmark';
import { likePost, savePost, unsavePost } from '../../services/posts';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8000/api/posts/getAll')
      .then(r => r.json())
      .then(r => setPosts(r.posts));
  }, []);

  const handleLike = async (postId, idx) => {
    const { data } = await likePost(postId, token);
    setPosts(ps => ps.map((p,i) => i===idx ? { ...p, likes: data.likes } : p));
  };

  const handleSave = async (postId, idx) => {
    const p = posts[idx];
    if (p._saved) {
      await unsavePost(postId, token);
    } else {
      await savePost(postId, token);
    }
    setPosts(ps => ps.map((p,i) =>
      i===idx ? { ...p, _saved: !p._saved } : p
    ));
  };

  return (
    <>
      {posts.map((post, i) => (
        <Box key={post._id} sx={{ mb: 4, border: '1px solid #ddd', p:2 }}>
          <img src={post.signedImageUrl} alt="" style={{ width:'100%' }} />

          <Box sx={{ display:'flex', alignItems:'center', mt:1 }}>
            <IconButton onClick={() => handleLike(post._id, i)}>
              {post.likes > 0 ? <Favorite color="error"/> : <FavoriteBorder />}
            </IconButton>
            <Typography>{post.likes}</Typography>

            <Box sx={{ flexGrow:1 }}/>
            <IconButton onClick={() => handleSave(post._id, i)}>
              {post._saved ? <Bookmark color="primary"/> : <BookmarkBorder />}
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Posted by {post.user.username}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default Posts;

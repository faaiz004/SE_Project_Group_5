import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const CaptionInput = ({ caption, setCaption }) => {
  return (
    <Box sx={{ mt: 3, width: '80%' }}>
      {/* Caption Input */}
      <Typography variant="subtitle1" sx={{ color: '#27374D', mb: 1 }}>
        Caption
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        sx={{ backgroundColor: '#fff', borderRadius: 1 }}
      />
    </Box>
  );
};

export default CaptionInput;

import React from 'react';
import { Box, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Navbar from '../../Layouts/StyleFeed/Navbar';
import Posts from '../../Layouts/StyleFeed/Posts'; 
import Recommendations from '../../Layouts/StyleFeed/Recommendations';
import { mainComp, postsBox, recommendationsBox, rootStyleFeed } from './Styles';

const StyleFeedPage = () => {
  return (
    <Box sx={{ ...rootStyleFeed, overflow: 'hidden' }}>
      {/* 1. Top Navbar */}
      <Navbar />

      {/* 2. Banner with Icon + Text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f8f8',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          maxWidth: '700px',
          margin: '20px auto',
          gap: 1.5,
        }}
      >
        <ShoppingBagIcon sx={{ color: '#5F65C3', fontSize: '28px' }} />
        <Typography sx={{ fontSize: '16px', color: '#444' }}>
          Discover outfits styled by creators you follow. Click to explore and add looks you love to your cart instantly.
        </Typography>
      </Box>

      {/* 3. Main Content Area: Left Posts, Right Recommendations */}
      <Box sx={mainComp}>
        <Box sx={postsBox}>
          <Posts />
        </Box>
        <Box sx={recommendationsBox}>
          <Recommendations />
        </Box>
      </Box>
    </Box>
  );
};

export default StyleFeedPage;



// // src/pages/StyleFeed/Index.jsx
// import React from 'react';
// import { Box, Typography, IconButton } from '@mui/material';
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import BookmarkIcon    from '@mui/icons-material/Bookmark';
// import { useNavigate } from 'react-router-dom';  // ← import this
// import Navbar from '../../Layouts/StyleFeed/Navbar';
// import Posts from '../../Layouts/StyleFeed/Posts'; 
// import Recommendations from '../../Layouts/StyleFeed/Recommendations';
// import { mainComp, postsBox, recommendationsBox, rootStyleFeed } from './Styles';

// const StyleFeedPage = () => {
//   const navigate = useNavigate();  // ← init navigate()

//   return (
//     <Box sx={{ ...rootStyleFeed, overflow: 'hidden' }}>
//       {/* 1. Top Navbar */}
//       <Navbar />

//       {/* 2. Banner with Icon + Text + Saved-Outfits button */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           backgroundColor: '#f8f8f8',
//           padding: '12px 20px',
//           borderRadius: '12px',
//           boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
//           maxWidth: '700px',
//           margin: '20px auto',
//           gap: 1.5,
//           position: 'relative',    // ← for absolutely positioning the button
//         }}
//       >
//         <ShoppingBagIcon sx={{ color: '#5F65C3', fontSize: '28px' }} />
//         <Typography sx={{ fontSize: '16px', color: '#444', flexGrow: 1 }}>
//           Discover outfits styled by creators you follow. Click to explore and add looks you love to your cart instantly.
//         </Typography>

//         {/* Saved Outfits button */}
//         <IconButton
//           onClick={() => navigate('/saved-outfits')}
//           sx={{
//             position: 'absolute',
//             top: 8,
//             right: 8,
//             color: '#5F65C3',
//           }}
//           aria-label="Saved Outfits"
//         >
//           <BookmarkIcon />
//         </IconButton>
//       </Box>

//       {/* 3. Main Content Area: Left Posts, Right Recommendations */}
//       <Box sx={mainComp}>
//         <Box sx={postsBox}>
//           <Posts />
//         </Box>
//         <Box sx={recommendationsBox}>
//           <Recommendations />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default StyleFeedPage;

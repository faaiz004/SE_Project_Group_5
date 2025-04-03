// SE_FrontEnd/src/pages/Chatbot/Styles.jsx
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ChatContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

export const ChatHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#27374D",
}));

// You can export a hook or directly export styled components.
export default () => ({
  container: {
    padding: 16,
  },
});

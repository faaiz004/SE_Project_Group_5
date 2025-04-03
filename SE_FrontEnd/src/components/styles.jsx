import { styled } from '@mui/material/styles';

export const ChatbotContainer = styled('div')({
  position: 'fixed',
  bottom: 20,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  zIndex: 1000,
});

export const ToggleButton = styled('button')({
  backgroundColor: '#27374D',
  color: 'white',
  borderRadius: '50%',
  padding: '10px',
  marginRight: '5px',
  '&:hover': {
    backgroundColor: '#1E293B',
  },
});

export const ChatbotWindow = styled('div')(({ isOpen }) => ({
  position: 'fixed',
  bottom: 20,
  right: isOpen ? '0px' : '-350px',
  width: '350px',
  height: '500px',
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
  borderRadius: '10px 0 0 10px',
  transition: 'right 0.3s ease-in-out',
}));

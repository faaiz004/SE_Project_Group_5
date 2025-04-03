// SE_FrontEnd/src/components/ChatbotWidget.jsx
import React, { useState } from 'react';
import Chatbot from '../pages/Chatbot/Index'; // Import your Chatbot page
import { Box } from '@mui/material';
import chatIcon from '../assets/react.svg'; // Replace with your chatbot icon image

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Icon */}
      <Box 
        onClick={toggleChat} 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundImage: `url(${chatIcon})`,
          backgroundSize: 'cover',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      />

      {/* Conditionally render the Chatbot popup */}
      {isOpen && (
        <Box 
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            zIndex: 1000,
          }}
        >
          <Chatbot />
        </Box>
      )}
    </>
  );
};

export default ChatbotWidget;

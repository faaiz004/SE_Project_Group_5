import React, { useState } from 'react';
import Chatbot from '../pages/Chatbot/index';
import { Box, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ChatbotContainer, ChatbotWindow } from '../pages/Chatbot/Styles';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatbotContainer>
      {/* Toggle Button */}
      <IconButton
        onClick={toggleChat}
        sx={{ backgroundColor: '#27374D', color: 'white', borderRadius: '50%', p: 1, mr: 1 }}
      >
        {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
      </IconButton>

      {/* Chatbot Window */}
      <ChatbotWindow isOpen={isOpen}>
        <Chatbot closeChat={closeChat} />
      </ChatbotWindow>
    </ChatbotContainer>
  );
};

export default ChatbotWidget;

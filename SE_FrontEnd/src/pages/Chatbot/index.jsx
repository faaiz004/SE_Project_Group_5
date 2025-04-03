import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from './Styles';

const Chatbot = ({ closeChat }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState(null);

  // Handler to send message to LLM API via your backend
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    const userMessage = { role: "user", content: msg };
    // Append user message to state
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      // Prepare the messages payload for the Llama API.
      // We include a system prompt for context, your conversation history,
      // and the new user message.
      const payload = {
        messages: [
          { role: "system", content: "You are a helpful assistant to give recommendations about different pieces of clothing from various categories" },
          ...messages,
          userMessage
        ],
        model: "llama3.3-70b"  // Change this to the desired model if needed.
      };

      // Make a POST request to the Llama API endpoint
      const response = await axios.post(
        "https://api.llama-api.com/chat/completions",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer d7e7ad95-9f04-486b-b2f1-b7ef66cc5fce" // Replace with your actual API key.
          }
        }
      );

      // Append the bot's reply to the messages state
      const botMessage = { role: "bot", content: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong." }
      ]);
    }
  };

  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    // You can trigger a new conversation or add context based on category selection
    setMessages(prev => [
      ...prev,
      { role: "user", content: `I want to know more about ${selectedCategory} clothing.` }
    ]);
  };

  return (
    <Box sx={classes.chatbotBox}>
      {/* Header with Title and Close Button */}
      <Box sx={classes.header}>
        <Typography variant="h5" sx={classes.title}>Chat with Stylist</Typography>
        <IconButton onClick={closeChat} sx={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Category Buttons */}
      <Box sx={classes.categoryButtons}>
        <Button onClick={() => selectCategory("Formal")} variant="contained" sx={classes.categoryButton}>
          Formal
        </Button>
        <Button onClick={() => selectCategory("Eastern")} variant="contained" sx={classes.categoryButton}>
          Eastern
        </Button>
        {/* Add more categories as needed */}
      </Box>

      {/* Messages Display */}
      <Box sx={classes.messagesContainer}>
        {messages.map((msg, idx) => (
          <Typography key={idx} sx={msg.role === "user" ? classes.userMessage : classes.botMessage}>
            {msg.content}
          </Typography>
        ))}
      </Box>

      {/* Typing Area */}
      <Box sx={classes.inputContainer}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(input); }}
          sx={classes.textField}
        />
        <Button variant="contained" onClick={() => sendMessage(input)} sx={classes.sendButton}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;

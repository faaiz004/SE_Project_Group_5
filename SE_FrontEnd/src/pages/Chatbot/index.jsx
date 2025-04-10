import React, { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from './Styles';

// Initialize the InferenceClient with your API key
const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_API_KEY);


const Chatbot = ({ closeChat }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState(null);


  // Handler to send message using the Hugging Face InferenceClient
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    const userMessage = { role: "user", content: msg };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const payload = {
        provider: "fireworks-ai",
        model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant to give recommendations about clothing."
          },
          ...newMessages
        ],
        max_tokens: 500,
      };

      console.log("Payload:", payload);
      const chatCompletion = await client.chatCompletion(payload);
      console.log("API Response:", chatCompletion);
      const botMessage = {
        role: "assistant",
        content: chatCompletion.choices?.[0]?.message?.content || "No response received."
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." }
      ]);
    }
  };

  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    const categoryMessage = {
      role: "user",
      content: `I want to know more about ${selectedCategory} clothing.`
    };
    setMessages(prev => [...prev, categoryMessage]);
  };

  return (
    <Box sx={classes.chatbotBox}>
      {/* Header with Title and Close Button */}
      <Box sx={classes.header}>
        <Typography variant="h5" sx={classes.title}>
          Chat with Stylist
        </Typography>
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
      </Box>

      {/* Messages Display */}
      <Box sx={classes.messagesContainer}>
        {messages.map((msg, idx) => (
          <Typography
            key={idx}
            sx={msg.role === "user" ? classes.userMessage : classes.botMessage}
          >
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage(input);
            }
          }}
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

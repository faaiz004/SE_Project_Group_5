import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';
import useStyles from './Styles'; // Optional: custom hook for styles

const Chatbot = () => {
  const classes = useStyles ? useStyles() : {}; // if using custom styles
  const [messages, setMessages] = useState([]); // { role: "user" | "bot", content: "..." }
  const [input, setInput] = useState("");

  // Handler to send message to LLaMA API
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    // Append the user message
    const userMessage = { role: "user", content: msg };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      // Call LLaMA API
      const response = await axios.post(
        "http://localhost:8000/llama/chat",  // LLaMA API endpoint
        { prompt: msg },
        {
          headers: {
            "Authorization": `Bearer d7e7ad95-9f04-486b-b2f1-b7ef66cc5fce`,  // Your API Key
            "Content-Type": "application/json"
          }
        }
      );

      const botMessage = { role: "bot", content: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling LLaMA API:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, something went wrong." }]);
    }
  };

  // Helper to send message on button click or Enter key
  const handleSend = () => sendMessage(input);

  return (
    <Box sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#27374D" }}>
        Chat with Stylist
      </Typography>
      
      {/* Display conversation */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, border: '1px solid #eee', p: 2 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1, textAlign: msg.role === "user" ? 'right' : 'left' }}>
            <Typography variant="body1" sx={{ display: 'inline-block', background: msg.role === "user" ? '#007bff' : '#eee', color: msg.role === "user" ? '#fff' : '#000', p: 1, borderRadius: 1 }}>
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Input field */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(input); }}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>

      {/* Optional: Category Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
        {["Formal", "Eastern", "Casual"].map(category => (
          <Button key={category} variant="outlined" onClick={() => sendMessage(category)}>
            {category}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Chatbot;

// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   LinearProgress,
//   CircularProgress
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import useStyles from './styles.jsx';

// const Chatbot = ({ closeChat }) => {
//   const classes = useStyles();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async (msg) => {
//     if (!msg.trim()) return;
  
//     const userMessage = { role: "user", content: msg };
//     const history = [...messages, userMessage];
//     setMessages(history);
//     setInput("");
//     setLoading(true);
  
//     try {
//       const resp = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo",
//           messages: [
//             { role: "system", content: "You are a helpful assistant to give recommendations about clothing." },
//             ...history,
//           ],
//           max_tokens: 500,
//           temperature: 0.7,
//         }),
//       });
  
//       if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
//       const data = await resp.json();
//       const botContent = data.choices?.[0]?.message?.content || "No response received.";
//       setMessages(prev => [...prev, { role: "assistant", content: botContent }]);
//     } catch (err) {
//       console.error("OpenAI Fetch Error:", err);
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", content: "Sorry, something went wrong." }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const selectCategory = (category) => {
//     const catMsg = { role: "user", content: `I want to know more about ${category} clothing.` };
//     setMessages(prev => [...prev, catMsg]);
//   };

//   return (
//     <Box sx={classes.chatbotBox}>
//       {loading && <LinearProgress sx={{ position: 'absolute', top: 0, width: '100%' }} />}
      
//       <Box sx={classes.header}>
//         <Typography variant="h5" sx={classes.title}>Chat with Stylist</Typography>
//         <IconButton onClick={closeChat} sx={classes.closeButton} disabled={loading}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <Box sx={classes.categoryButtons}>
//         <Button
//           onClick={() => selectCategory("Formal")}
//           variant="contained"
//           sx={classes.categoryButton}
//           disabled={loading}
//         >
//           Formal
//         </Button>
//         <Button
//           onClick={() => selectCategory("Eastern")}
//           variant="contained"
//           sx={classes.categoryButton}
//           disabled={loading}
//         >
//           Eastern
//         </Button>
//       </Box>

//       <Box sx={classes.messagesContainer}>
//         {messages.map((m, i) => (
//           <Typography
//             key={i}
//             sx={m.role === "user" ? classes.userMessage : classes.botMessage}
//           >
//             {m.content}
//           </Typography>
//         ))}
//       </Box>

//       <Box sx={classes.inputContainer}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Type your message..."
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyPress={e => {
//             if (e.key === 'Enter') {
//               e.preventDefault();
//               sendMessage(input);
//             }
//           }}
//           disabled={loading}
//           sx={classes.textField}
//         />
//         <Button
//           variant="contained"
//           onClick={() => sendMessage(input)}
//           disabled={loading}
//           sx={classes.sendButton}
//         >
//           {loading
//             ? <CircularProgress size={24} color="inherit" />
//             : 'Send'}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Chatbot;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from './styles.jsx';

const Chatbot = ({ closeChat }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
  
    const userMessage = { role: "user", content: msg };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setLoading(true);
  
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant to give recommendations about clothing." },
            ...history,
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
  
      if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
      const data = await resp.json();
      const botContent = data.choices?.[0]?.message?.content || "No response received.";
      setMessages(prev => [...prev, { role: "assistant", content: botContent }]);
    } catch (err) {
      console.error("OpenAI Fetch Error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={classes.chatbotBox}>
      {loading && <LinearProgress sx={{ position: 'absolute', top: 0, width: '100%' }} />}
      
      <Box sx={classes.header}>
        <Typography variant="h5" sx={classes.title}>Chat with Stylist</Typography>
        <IconButton onClick={closeChat} sx={classes.closeButton} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={classes.messagesContainer}>
        {messages.map((m, i) => (
          <Typography
            key={i}
            sx={m.role === "user" ? classes.userMessage : classes.botMessage}
          >
            {m.content}
          </Typography>
        ))}
      </Box>

      <Box sx={classes.inputContainer}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={loading}
          sx={classes.textField}
        />
        <Button
          variant="contained"
          onClick={() => sendMessage(input)}
          disabled={loading}
          sx={classes.sendButton}
        >
          {loading
            ? <CircularProgress size={24} color="inherit" />
            : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;


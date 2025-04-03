import RouterComponent from "./router/Index"
import ChatbotWidget from './components/ChatbotWidget';
import './App.css';
import React from 'react';


function App() {
  return (
    <div>
      <RouterComponent />
      <ChatbotWidget />
    </div>
  );
}

export default App

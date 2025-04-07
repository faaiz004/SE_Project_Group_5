import RouterComponent from "./router/Index"
import ChatbotWidget from './components/ChatbotWidget';
import './App.css';
import React from 'react';


function App() {
  const clientId = '504000425247-77r9cef35s7h8srtmmhnvfgh89qivlka.apps.googleusercontent.com';
  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}></GoogleOAuthProvider>
      <RouterComponent />
      <ChatbotWidget />
    </div>
  );
}

export default App

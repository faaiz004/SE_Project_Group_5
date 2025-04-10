import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RouterComponent from "./router/Index";
import ChatbotWidget from "./components/ChatbotWidget";
import "./App.css";

function App() {
  const clientId = "504000425247-77r9cef35s7h8srtmmhnvfgh89qivlka.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RouterComponent />
      <ChatbotWidget />
    </GoogleOAuthProvider>
  );
}

export default App;

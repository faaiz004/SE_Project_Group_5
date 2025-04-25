import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RouterComponent from "./router/Index";
import ChatbotWidget from "./components/ChatbotWidget";
import "./App.css";

function App() {
	const clientId =
		"504000425247-77r9cef35s7h8srtmmhnvfgh89qivlka.apps.googleusercontent.com";
	const [showSessionModal, setShowSessionModal] = useState(false);

	useEffect(() => {
		const handleForceLogin = () => {
			setShowSessionModal(true);
		};

		window.addEventListener("force-login", handleForceLogin);
		return () => window.removeEventListener("force-login", handleForceLogin);
	}, []);

	const clearStorageAndRedirect = (path) => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = path;
	};

	const handleSignUp = () => clearStorageAndRedirect("/sign-up");
	const handleSignIn = () => clearStorageAndRedirect("/sign-in");

	return (
		<GoogleOAuthProvider clientId={clientId}>
			{showSessionModal && (
				<div className="modal-overlay">
					<div className="modal-box">
						<h2 className="modal-title">Session Expired</h2>
						<p className="modal-message">
							Your session has expired. Please sign in or sign up to continue.
						</p>
						<div className="modal-actions">
							<button className="btn-secondary" onClick={handleSignUp}>
								Sign up
							</button>
							<button className="btn-primary" onClick={handleSignIn}>
								Sign in
							</button>
						</div>
					</div>
				</div>
			)}
			<RouterComponent />
			<ChatbotWidget />
		</GoogleOAuthProvider>
	);
}

export default App;

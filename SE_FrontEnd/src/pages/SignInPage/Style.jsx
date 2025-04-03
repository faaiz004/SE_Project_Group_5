// src/style.js

export const pageContainer = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100vh",
    fontFamily: "sans-serif",
    overflow: "hidden",
  };
  
  export const leftContainer = {
    flex: 1,
    backgroundColor: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem", // Reduced padding
    overflow: "hidden",
    height: "100%",
    boxSizing: "border-box",
  };
  
  export const rightContainer = {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem", // Reduced padding
    overflow: "hidden",
    height: "100%",
    boxSizing: "border-box",
  };
  
  export const title = {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    textAlign: "center",
  };
  
  // Subheading
  export const subtitle = {
    fontSize: "1.1rem",
    fontWeight: 400,
    marginBottom: "1.5rem",
    color: "#555",
    textAlign: "center",
    lineHeight: 1.4,
  };
  
  export const collageContainer = {
    position: "relative",
    width: "90%", // More contained width
    height: "60vh", // Fixed height relative to viewport
    margin: "0 auto",
    overflow: "hidden",
  };
  
  // Adjusted image sizes and positions using percentages
  export const collageImage1 = {
    position: "absolute",
    top: "5%",
    left: "5%",
    width: "30%",
    maxWidth: "150px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    opacity: 0.5,
    zIndex: 1,
  };
  
  export const collageImage2 = {
    position: "absolute",
    top: "5%",
    left: "35%",
    width: "30%",
    maxWidth: "150px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    opacity: 0.5,
    zIndex: 1,
  };
  
  export const collageImage3 = {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: "35%",
    maxWidth: "160px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: 2,
  };
  
  export const collageImage4 = {
    position: "absolute",
    top: "25%",
    left: "45%",
    width: "35%",
    maxWidth: "160px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: 2,
  };
  
  export const collageImage5 = {
    position: "absolute",
    top: "50%",
    left: "25%",
    width: "40%",
    maxWidth: "180px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
    zIndex: 3,
  };
  
  export const mannequinImage = {
    width: "100%",
    maxWidth: "500px",
    height: "auto",
    margin: "1rem 0", // Reduced margin
  };
  
  export const buttonContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem", // Smaller gap
    width: "80%",
    maxWidth: "300px",
  };
  
  export const signInButton = {
    backgroundColor: "#F1C40F", // Yellow color
    color: "#fff",
    padding: "0.6rem 1rem",
    fontSize: "0.9rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  
  export const googleButton = {
    backgroundColor: "#000000",
    color: "#fff",
    padding: "0.6rem 1rem", // Smaller padding
    fontSize: "0.9rem", // Smaller font
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  
  // Add this global style to your root component
  export const globalStyles = {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    'img': {
      maxWidth: '100%',
      height: 'auto',
    }
  };
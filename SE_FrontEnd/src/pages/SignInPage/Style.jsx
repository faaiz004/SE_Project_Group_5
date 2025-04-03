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
    backgroundColor: "#f0f0f0", // Lighter gray to match image
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
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
    padding: "2rem", // Increased padding slightly
    overflow: "hidden",
    height: "100%",
    boxSizing: "border-box",
  };
  
  export const title = {
    fontSize: "2.5rem", // Larger font size
    fontWeight: 700, // Bolder
    marginBottom: "0.5rem",
    textAlign: "center",
    color: "#2c3e50", // Darker color for "Welcome To"
    lineHeight: 1.2,
  };
  
  export const titleHighlight = {
    color: "#F1C40F", // Yellow color for "Swipe-FIT"
    fontSize: "2.5rem",
    fontWeight: 700,
  };
  
  // Subheading
  export const subtitle = {
    fontSize: "1rem", // Slightly smaller
    fontWeight: 400,
    marginBottom: "2rem", // More space before mannequin
    color: "#555",
    textAlign: "center",
    lineHeight: 1.4,
  };
  
  export const collageContainer = {
    position: "relative",
    width: "85%", // Slightly narrower to ensure images don't overflow horizontally
    height: "80%", // Adjusted to fit all 5 images
    maxHeight: "480px",
    margin: "0 auto",
  };
  
  // Repositioned images to create a collage with visible gaps
  export const collageImage1 = {
    position: "absolute",
    top: "0%",
    left: "0%",
    width: "30%", // Slightly smaller
    maxWidth: "140px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 1,
  };
  
  export const collageImage2 = {
    position: "absolute",
    top: "0%",
    left: "38%", // Moved right to create gap
    width: "28%", // Slightly smaller
    maxWidth: "130px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    backgroundColor: "#F1C40F", // Yellow background for this image
    zIndex: 1,
  };
  
  export const collageImage3 = {
    position: "absolute",
    top: "28%", // Adjusted to create vertical gap
    left: "5%", // Moved right slightly
    width: "35%", // Slightly smaller
    maxWidth: "160px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: 2,
  };
  
  export const collageImage4 = {
    position: "absolute",
    top: "25%", // Adjusted to create gap with image 2
    left: "45%", // Moved right to create gap with image 3
    width: "35%", // Slightly smaller
    maxWidth: "160px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: 2,
  };
  
  // Reincorporated collageImage5 with adjusted positioning
  export const collageImage5 = {
    position: "absolute",
    top: "55%", // Positioned below images 3 and 4
    left: "25%", // Centered horizontally
    width: "35%", // Slightly smaller
    maxWidth: "160px",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
    zIndex: 3,
  };
  
  export const mannequinImage = {
    width: "100%",
    maxWidth: "450px", // Slightly smaller to ensure it fits
    height: "auto",
    margin: "0 0 1.5rem 0", // Reduced margin to ensure buttons fit
  };
  
  export const buttonContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: "80%",
    maxWidth: "300px",
  };
  
  export const signInButton = { // This should be renamed to signUpButton in your component
    backgroundColor: "#F1C40F", // Yellow color
    color: "#fff",
    padding: "0.7rem 1rem", // Slightly reduced padding
    fontSize: "1rem",
    fontWeight: 600,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%", // Full width of container
    textAlign: "center",
  };
  
  export const orDivider = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0.25rem 0",
    color: "#777",
    fontSize: "0.8rem",
  };
  
  export const googleButton = {
    backgroundColor: "#000000",
    color: "#fff",
    padding: "0.7rem 1rem", // Slightly reduced padding
    fontSize: "0.9rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%", // Full width of container
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem", // Space for Google icon
  };
  
  export const googleIcon = {
    width: "18px",
    height: "18px",
    marginRight: "8px",
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
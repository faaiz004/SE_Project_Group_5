// Styles for AllClothesSearch component

export const pageContainer = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#f5f5f5",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  }
  
  export const headerContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: { xs: "12px 16px", md: "16px 24px" },
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
  }
  
  export const logoStyle = {
    fontSize: { xs: 24, md: 32 },
    fontWeight: 700,
    color: "#000000",
    textDecoration: "none",
  }
  
  export const headerIconsContainer = {
    display: "flex",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  }
  
  export const searchContainer = {
    width: "100%",
    padding: { xs: "12px 16px", md: "16px 24px" },
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "center",
  }
  
  export const contentContainer = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: { xs: "16px", md: "24px" },
  }
  
  export const titleStyle = {
    fontSize: { xs: 24, md: 28 },
    fontWeight: 600,
    color: "#27374D",
    marginBottom: 3,
  }
  
  export const gridContainer = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
    },
    gap: { xs: 2, md: 2.5 },
    width: "100%",
  }
  
  export const cardStyle = {
    display: "flex",
    flexDirection: "column",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: 1,
    bgcolor: "#fff",
    height: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 3,
      zIndex: 1,
    },
  }
  
  export const buttonContainerStyle = {
    display: "flex",
    gap: 1,
    padding: 1.5,
    width: "100%",
  }
  
  export const buttonStyle = {
    bgcolor: "#2D333A",
    color: "#fff",
    textTransform: "none",
    fontSize: { xs: 13, md: 14 },
    padding: "6px 8px",
    minWidth: 0,
    flex: 1,
    "&:hover": {
      bgcolor: "#1f2428",
    },
  }
  
  export const searchInputStyle = {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#f5f5f5",
    borderRadius: "50px", // Pill shape
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px", // Pill shape
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#bdbdbd",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2D333A",
      },
    },
  }
  
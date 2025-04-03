export const formStyles = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "2rem", // equivalent to space-y-8
    minHeight: "100vh", // Ensures the form takes at least the full height of the viewport
    alignItems: "center",
    justifyContent: "center",
  };
  
  export const gridContainerStyles = {
    // Grid container styles (handled via Grid props for responsiveness)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };
  
  export const leftSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem", // equivalent to space-y-6
  };
  
  export const rightSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem", // equivalent to space-y-6
  };
  
  export const imageUploadLabelStyles = {
    width: "300px", // w-64
    height: "300px", // h-64
    borderRadius: "50%",
    border: "2px dashed #d1d5db", // border-dashed border-gray-300
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb", // hover:bg-gray-50
    },
  };
  
  export const imagePreviewContainerStyles = {
    width: "300px", // w-64
    height: "300px", // h-64
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #e5e7eb", // border-gray-200
    position: "relative",
  };
  
  export const removeButtonStyles = {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: "50%",
  };
  
  export const captionSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem", // space-y-2
    marginTop: "1rem",
  };
  
  export const searchContainerStyles = {
    position: "relative",
  };
  
  export const searchInputStyles = {
    width: "100%",
    padding: "8px",
    paddingLeft: "40px",
    fontSize: "0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    "&:focus": {
      borderColor: "#3b82f6",
      outline: "none",
      boxShadow: "0 0 0 1px #3b82f6",
    },
  };
  
  export const scrollAreaStyles = {
    width: "100%",
    whiteSpace: "nowrap",
    paddingBottom: "1rem", // pb-4
  };
  
  export const cardStyles = (selected) => ({
    width: "200px",
    flexShrink: 0,
    cursor: "pointer",
    transition: "all 0.2s ease",
    ...(selected && { boxShadow: "0 0 0 2px #3b82f6" }), // ring-2 ring-primary
  });
  
  export const cardContentStyles = {
    padding: "16px", // p-4
  };
  
  export const noItemsStyles = {
    paddingTop: "2.5rem", // py-10
    paddingBottom: "2.5rem",
    textAlign: "center",
    width: "100%",
    color: "#6b7280", // text-gray-500
  };
  
  export const submitButtonContainerStyles = {
    display: "flex",
    justifyContent: "flex-end", // flex justify-end
    marginBottom: "2rem", // mb-8
  };
  
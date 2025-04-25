export const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Roboto, sans-serif',
    },
    
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      margin: '20px auto',
      gap: '24px',
    },
    
    sidebar: {
      width: '250px',
      flexShrink: 0,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    },
    
    contentArea: {
      flexGrow: 1,
      display: 'flex',
    },
    
    contentPaper: {
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    
    contentHeader: {
      padding: '24px',
    },
    
    contentTitle: {
      fontWeight: 500,
      marginBottom: '8px',
    },
    
    contentBody: {
      padding: '24px',
    },
    
    contentFooter: {
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    
    profilePictureSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '32px',
    },
    
    profileAvatar: {
      width: '100px',
      height: '100px',
      marginBottom: '16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    
    uploadButtonContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    
    nameFieldsContainer: {
      display: 'flex',
      gap: '16px',
    },
    
    textField: {
      backgroundColor: '#ffffff',
    },
    
    savedCard: {
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#f9f9f9',
    },
    
    outfitCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    
    addOutfitCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      border: '2px dashed #ccc',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#1976d2',
        backgroundColor: '#f0f7ff',
      },
    },
    
    infoDisplay: {
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    },
  };
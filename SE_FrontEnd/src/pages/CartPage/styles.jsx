export const cartStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  backButton: {
    color: '#333',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '16px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  divider: {
    my: 2,
  },
  title: {
    fontWeight: 600,
    fontSize: '24px',
    mt: 2,
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    mb: 4,
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    mb: 2,
    gap: 2,
  },
  productImageContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productInfo: {
    flex: 1,
    ml: 2,
  },
  productName: {
    fontWeight: 600,
    fontSize: '18px',
  },
  productDescription: {
    color: '#666',
    fontSize: '14px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  quantityButton: {
    borderRadius: 0,
    padding: '4px 8px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    '&:hover': {
      backgroundColor: '#e5e5e5',
    }
  },
  quantityDisplay: {
    width: '40px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productPrice: {
    fontWeight: 600,
    width: '80px',
    textAlign: 'right',
  },
  deleteButton: {
    color: '#999',
  },
  summaryContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  previewImagesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  topPreviewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '200px',
    objectFit: 'contain',
    mb: 2,
  },
  bottomPreviewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '200px',
    objectFit: 'contain',
  },
  totalContainer: {
    padding: '20px',
    textAlign: 'right',
  },
  totalPrice: {
    fontWeight: 700,
    fontSize: '28px',
  },
  taxesNote: {
    color: '#666',
    fontSize: '14px',
    mb: 3,
  },
  checkoutButton: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 20px',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#222',
    }
  },
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Container
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  CreditCard as CreditCardIcon, 
  Checkroom as CheckroomIcon,
  PhotoCamera as PhotoCameraIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Style as StyleIcon
} from '@mui/icons-material';
import { styles } from './styles';

// Mock data for saved outfits
const savedOutfits = [
  {
    id: 1,
    name: "Casual Friday",
    shirt: { id: 101, name: "Blue Oxford Shirt", image: "/placeholder-shirt.jpg", size: "M", color: "Blue" },
    pants: { id: 201, name: "Khaki Chinos", image: "/placeholder-pants.jpg", size: "M", color: "Beige" }
  },
  {
    id: 2,
    name: "Weekend Brunch",
    shirt: { id: 102, name: "White Linen Shirt", image: "/placeholder-shirt.jpg", size: "L", color: "White" },
    pants: { id: 202, name: "Dark Jeans", image: "/placeholder-pants.jpg", size: "L", color: "Indigo" }
  },
  {
    id: 3,
    name: "Office Meeting",
    shirt: { id: 103, name: "Striped Dress Shirt", image: "/placeholder-shirt.jpg", size: "M", color: "White/Blue" },
    pants: { id: 203, name: "Navy Slacks", image: "/placeholder-pants.jpg", size: "M", color: "Navy" }
  }
];

const Account = () => {
    const navigate = useNavigate();
    const navigateTo = (path) => {
        navigate(path);
    };
  const [activeTab, setActiveTab] = useState('account');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });
  
  // State for clothing preferences
  const [gender, setGender] = useState('male');
  const [shirtSize, setShirtSize] = useState('m');
  const [pantSize, setPantSize] = useState('m');
  const [selectedClothingTypes, setSelectedClothingTypes] = useState(['Casual', 'Business Casual']);
  
  // State for credit cards
  const [savedCards, setSavedCards] = useState([
    { id: 1, cardNumber: "**** **** **** 4321", expiryDate: "05/25", cardHolder: "John Doe", type: "Visa" },
    { id: 2, cardNumber: "**** **** **** 8765", expiryDate: "12/24", cardHolder: "John Doe", type: "Mastercard" }
  ]);
  
  const [newCard, setNewCard] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };
  
  const handleSaveUserInfo = () => {
    setIsEditing(false);
  };
  
  const handleEditUserInfo = () => {
    setIsEditing(true);
  };
  
  const handleNewCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value
    });
  };
  
  const handleAddCard = () => {
    // Simple validation
    if (!newCard.cardHolder || !newCard.cardNumber || !newCard.expiryDate || !newCard.cvc) {
      alert('Please fill in all required card fields');
      return;
    }
    
    // Format card number to show only last 4 digits
    const formattedCardNumber = "**** **** **** " + newCard.cardNumber.slice(-4);
    
    // Add new card to saved cards
    const newCardObj = {
      id: savedCards.length + 1,
      cardNumber: formattedCardNumber,
      expiryDate: newCard.expiryDate,
      cardHolder: newCard.cardHolder,
      type: newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard' // Simple card type detection
    };
    
    setSavedCards([...savedCards, newCardObj]);
    
    // Reset form
    setNewCard({
      cardHolder: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    });
  };
  
  const handleDeleteCard = (cardId) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
  };
  
  const handleClothingTypeClick = (type) => {
    if (selectedClothingTypes.includes(type)) {
      setSelectedClothingTypes(selectedClothingTypes.filter(t => t !== type));
    } else {
      setSelectedClothingTypes([...selectedClothingTypes, type]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Account Information</Typography>
              <Typography variant="body2" color="text.secondary">
                Update your personal information and profile picture
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {/* Profile Picture Upload */}
              <Box sx={styles.profilePictureSection}>
                <Avatar 
                  src={profileImage} 
                  sx={styles.profileAvatar}
                >
                  {!profileImage && 'UP'}
                </Avatar>
                <Box sx={styles.uploadButtonContainer}>
                  <input
                    accept="image/*"
                    id="profile-image-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profile-image-upload">
                    <Button 
                      variant="outlined" 
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                    >
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Box>

              {/* Personal Information Form or Display */}
              {isEditing ? (
                <Box sx={styles.formSection}>
                  <Box sx={styles.nameFieldsContainer}>
                    <TextField
                      label="First Name"
                      variant="outlined"
                      placeholder="John"
                      fullWidth
                      sx={styles.textField}
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleUserInfoChange}
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      placeholder="Doe"
                      fullWidth
                      sx={styles.textField}
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleUserInfoChange}
                    />
                  </Box>
                  
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    placeholder="john.doe@example.com"
                    fullWidth
                    sx={styles.textField}
                    name="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                  />
                  
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    placeholder="+1 (555) 000-0000"
                    fullWidth
                    sx={styles.textField}
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                  />
                  
                  <TextField
                    label="Bio"
                    variant="outlined"
                    placeholder="Tell us about yourself"
                    fullWidth
                    multiline
                    rows={3}
                    sx={styles.textField}
                    name="bio"
                    value={userInfo.bio}
                    onChange={handleUserInfoChange}
                  />
                </Box>
              ) : (
                <Box sx={styles.infoDisplay}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
                    <Typography variant="body1">{userInfo.firstName} {userInfo.lastName}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                    <Typography variant="body1">{userInfo.email}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                    <Typography variant="body1">{userInfo.phone}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Bio</Typography>
                    <Typography variant="body1">{userInfo.bio}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={styles.contentFooter}>
              {isEditing ? (
                <Button variant="contained" color="primary" onClick={handleSaveUserInfo}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditUserInfo}>
                  Edit Information
                </Button>
              )}
            </Box>
          </Paper>
        );
        
      case 'preferences':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Preferences</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your clothing preferences and sizes
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {/* Gender Preference - Vertical Layout */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Gender</Typography>
                <FormControl component="fieldset">
                  <RadioGroup 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Shirt Size - Vertical Layout */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Shirt Size</Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                  >
                    <MenuItem value="s">Small</MenuItem>
                    <MenuItem value="m">Medium</MenuItem>
                    <MenuItem value="l">Large</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Pant Size - Vertical Layout */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Pant Size</Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={pantSize}
                    onChange={(e) => setPantSize(e.target.value)}
                  >
                    <MenuItem value="s">Small</MenuItem>
                    <MenuItem value="m">Medium</MenuItem>
                    <MenuItem value="l">Large</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Clothing Types - Vertical Layout with selectable chips */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Preferred Clothing Types</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {["Modern", "Business", "Old Money", "Casual"].map((type) => (
                    <Chip 
                      key={type}
                      label={type} 
                      color="primary" 
                      variant={selectedClothingTypes.includes(type) ? "filled" : "outlined"}
                      onClick={() => handleClothingTypeClick(type)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box sx={styles.contentFooter}>
              <Button variant="contained" color="primary">
                Save Preferences
              </Button>
            </Box>
          </Paper>
        );
        
      case 'billing':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Billing</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your payment methods and billing information
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {/* Saved Cards */}
              <Typography variant="h6" sx={{ mb: 2 }}>Saved Payment Methods</Typography>
              
              {savedCards.length > 0 ? (
                savedCards.map((card) => (
                  <Paper key={card.id} sx={styles.savedCard}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{card.type}</Typography>
                        <Typography variant="body2">{card.cardNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires: {card.expiryDate} | {card.cardHolder}
                        </Typography>
                      </Box>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No payment methods saved yet.
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              {/* Add New Card Form */}
              <Typography variant="h6" sx={{ mb: 2 }}>Add New Payment Method</Typography>
              
              <Box sx={styles.formSection}>
                <TextField
                  label="Cardholder Name"
                  variant="outlined"
                  placeholder="John Doe"
                  fullWidth
                  sx={styles.textField}
                  name="cardHolder"
                  value={newCard.cardHolder}
                  onChange={handleNewCardChange}
                  required
                />
                
                <TextField
                  label="Card Number"
                  variant="outlined"
                  placeholder="1234 5678 9012 3456"
                  fullWidth
                  sx={styles.textField}
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleNewCardChange}
                  required
                />
                
                <Box sx={styles.nameFieldsContainer}>
                  <TextField
                    label="Expiration Date"
                    variant="outlined"
                    placeholder="MM/YY"
                    fullWidth
                    sx={styles.textField}
                    name="expiryDate"
                    value={newCard.expiryDate}
                    onChange={handleNewCardChange}
                    required
                  />
                  <TextField
                    label="CVC"
                    variant="outlined"
                    placeholder="123"
                    fullWidth
                    sx={styles.textField}
                    name="cvc"
                    value={newCard.cvc}
                    onChange={handleNewCardChange}
                    required
                  />
                </Box>
                
                <TextField
                  label="Billing Address"
                  variant="outlined"
                  placeholder="123 Main St"
                  fullWidth
                  sx={styles.textField}
                  name="address"
                  value={newCard.address}
                  onChange={handleNewCardChange}
                />
                
                <Box sx={styles.nameFieldsContainer}>
                  <TextField
                    label="City"
                    variant="outlined"
                    placeholder="New York"
                    fullWidth
                    sx={styles.textField}
                    name="city"
                    value={newCard.city}
                    onChange={handleNewCardChange}
                  />
                  <TextField
                    label="State"
                    variant="outlined"
                    placeholder="NY"
                    fullWidth
                    sx={styles.textField}
                    name="state"
                    value={newCard.state}
                    onChange={handleNewCardChange}
                  />
                  <TextField
                    label="Zip Code"
                    variant="outlined"
                    placeholder="10001"
                    fullWidth
                    sx={styles.textField}
                    name="zipCode"
                    value={newCard.zipCode}
                    onChange={handleNewCardChange}
                  />
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={handleAddCard}
                >
                  Add Card
                </Button>
              </Box>
            </Box>
          </Paper>
        );
        
      case 'settings':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your account settings and preferences
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              <List>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email notifications"
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="SMS notifications"
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <FormControlLabel
                    control={<Switch />}
                    label="Dark mode"
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Two-factor authentication"
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Show recommendations based on browsing history"
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Allow data collection for personalized experience"
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 4 }}>
                <Button variant="outlined" color="error" sx={{ mr: 2 }}>
                  Delete Account
                </Button>
                <Button variant="outlined">
                  Export My Data
                </Button>
              </Box>
            </Box>
            <Divider />
            <Box sx={styles.contentFooter}>
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
            </Box>
          </Paper>
        );
        
      case 'savedOutfits':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Saved Outfits</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your saved outfit combinations
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              <Grid container spacing={3}>
                {savedOutfits.map((outfit) => (
                  <Grid item xs={12} sm={6} md={4} key={outfit.id}>
                    <Card sx={styles.outfitCard}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {outfit.name}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {/* Shirt */}
                          <Grid item xs={6}>
                            <Card variant="outlined">
                              <CardMedia
                                component="img"
                                height="140"
                                image={outfit.shirt.image || "https://via.placeholder.com/140x140?text=Shirt"}
                                alt={outfit.shirt.name}
                              />
                              <CardContent sx={{ p: 1 }}>
                                <Typography variant="body2" noWrap>
                                  {outfit.shirt.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Size: {outfit.shirt.size} | {outfit.shirt.color}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          {/* Pants */}
                          <Grid item xs={6}>
                            <Card variant="outlined">
                              <CardMedia
                                component="img"
                                height="140"
                                image={outfit.pants.image || "https://via.placeholder.com/140x140?text=Pants"}
                                alt={outfit.pants.name}
                              />
                              <CardContent sx={{ p: 1 }}>
                                <Typography variant="body2" noWrap>
                                  {outfit.pants.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Size: {outfit.pants.size} | {outfit.pants.color}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button size="small" startIcon={<ShoppingCartIcon />} color="primary">
                          Add to Cart
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />}>
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={styles.root}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                transform: 'scale(1.03)'
                }
            }} 
            onClick={() => navigateTo('/explore')}
            >
            Swipe-Fit
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="inherit" onClick={() => navigateTo('/stylefeed')}>
              <PersonAddIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigateTo('/cart')}>
              <ShoppingCartIcon />
            </IconButton>
            {/* <IconButton color="inherit">
              <StyleIcon />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content Area: Left Sidebar, Right Content */}
      <Container maxWidth="xl">
        <Box sx={styles.mainContainer}>
          {/* Left Sidebar */}
          <Paper sx={styles.sidebar}>
            <List component="nav" aria-label="account navigation">
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'preferences'}
                  onClick={() => setActiveTab('preferences')}
                >
                  <ListItemIcon>
                    <CheckroomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Preferences" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'savedOutfits'}
                  onClick={() => setActiveTab('savedOutfits')}
                >
                  <ListItemIcon>
                    <FavoriteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Saved Outfits" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'billing'}
                  onClick={() => setActiveTab('billing')}
                >
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Billing" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>

          {/* Right Content Area */}
          <Box sx={styles.contentArea}>
            {renderContent()}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Account;
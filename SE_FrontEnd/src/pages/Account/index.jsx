import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  Checkroom as CheckroomIcon,
  PhotoCamera as PhotoCameraIcon,
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getSavedClothes,
  unsaveClothes
} from '../../api/clothesService';
import {
  getPreferences,
  updatePreferences
} from '../../api/authService';
import { styles } from './styles';

/* ------------------------------------------------------------------
   Style-preference buttons : id ↔ label
------------------------------------------------------------------- */
const styleOptions = [
  { id: 'Modern',           name: 'Modern'    },
  { id: 'Smart_Casual',     name: 'Business'  },
  { id: 'Old_Money',        name: 'Old Money' },
  { id: 'Casual_Everyday',  name: 'Casual'    }
];

export default function Account() {
  const navigate = useNavigate();

  // TAB SELECTION
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem('activeTab') || 'account'
  );
  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // CART STATE
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(sessionStorage.getItem('cart')) || []
  );
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = item => {
    if (cartItems.some(ci => ci.productId === item._id)) return;
    setCartItems(prev => [
      ...prev,
      {
        productId: item._id,
        name: item.name,
        brand: item.brand,
        size: item.size,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      }
    ]);
  };

  const handleUnsave = async id => {
    try {
      await unsaveClothes(id);
      setFilteredData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to unsave:', err);
    }
  };

  /* ===============================================================
     1) ACCOUNT-INFO STATE
  =============================================================== */
  const [profileImage, setProfileImage] = useState(
    () => sessionStorage.getItem('profileImage') || null
  );
  useEffect(() => {
    if (profileImage !== null) {
      sessionStorage.setItem('profileImage', profileImage);
    }
  }, [profileImage]);

  const [isEditing, setIsEditing] = useState(
    () => JSON.parse(sessionStorage.getItem('isEditing')) ?? true
  );
  useEffect(() => {
    sessionStorage.setItem('isEditing', JSON.stringify(isEditing));
  }, [isEditing]);

  const [userInfo, setUserInfo] = useState(
    () => JSON.parse(sessionStorage.getItem('userInfo')) || {
      firstName: '', lastName: '', email: '', phone: '', bio: ''
    }
  );
  useEffect(() => {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  const handleUserInfoChange = e =>
    setUserInfo(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(f);
  };

  /* ===============================================================
     2) PREFERENCES STATE
  =============================================================== */
  const [gender, setGender] = useState(
    () => sessionStorage.getItem('gender') || ''
  );
  useEffect(() => {
    sessionStorage.setItem('gender', gender);
  }, [gender]);

  const [shirtSize, setShirtSize] = useState(
    () => sessionStorage.getItem('shirtSize') || ''
  );
  useEffect(() => {
    sessionStorage.setItem('shirtSize', shirtSize);
  }, [shirtSize]);

  const [pantSize, setPantSize] = useState(
    () => sessionStorage.getItem('pantSize') || ''
  );
  useEffect(() => {
    sessionStorage.setItem('pantSize', pantSize);
  }, [pantSize]);

  const [stylePref, setStylePref] = useState(
    () => sessionStorage.getItem('stylePref') || ''
  );
  useEffect(() => {
    sessionStorage.setItem('stylePref', stylePref);
  }, [stylePref]);

  const {
    data: fetchedPrefs = null,
    isLoading: prefLoading,
    isError: prefError
  } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getPreferences,
    enabled: activeTab === 'preferences'
  });

  useEffect(() => {
    if (fetchedPrefs) {
      setGender(fetchedPrefs.gender          || '');
      setShirtSize(fetchedPrefs.shirtSize    || '');
      setPantSize(fetchedPrefs.pantSize      || '');
      setStylePref(fetchedPrefs.stylePreference || '');
    }
  }, [fetchedPrefs]);

  const savePrefs = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => alert('Preferences saved!'),
    onError: ()   => alert('Could not save preferences')
  });

  /* ===============================================================
     3) BILLING STATE
  =============================================================== */
  const [savedCards, setSavedCards] = useState(
    () => JSON.parse(sessionStorage.getItem('savedCards')) || [
      { id: 1, cardNumber: '**** **** **** 4321', expiryDate: '05/25', cardHolder: 'John Doe', type: 'Visa' },
      { id: 2, cardNumber: '**** **** **** 8765', expiryDate: '12/24', cardHolder: 'John Doe', type: 'Mastercard' }
    ]
  );
  useEffect(() => {
    sessionStorage.setItem('savedCards', JSON.stringify(savedCards));
  }, [savedCards]);

  const [newCard, setNewCard] = useState(
    () => JSON.parse(sessionStorage.getItem('newCard')) || {
      cardHolder: '', cardNumber: '', expiryDate: '', cvc: '',
      address: '', city: '', state: '', zipCode: ''
    }
  );
  useEffect(() => {
    sessionStorage.setItem('newCard', JSON.stringify(newCard));
  }, [newCard]);

  const handleNewCardChange = e => {
    const { name, value } = e.target;
    setNewCard(p => ({ ...p, [name]: value }));
  };
  const handleAddCard = () => {
    if (!newCard.cardHolder || !newCard.cardNumber || !newCard.expiryDate || !newCard.cvc) {
      alert('Please fill in all required card fields');
      return;
    }
    const formattedNumber = '**** **** **** ' + newCard.cardNumber.slice(-4);
    const cardType = newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
    setSavedCards(prev => [
      ...prev,
      {
        id: prev.length + 1,
        cardNumber: formattedNumber,
        expiryDate: newCard.expiryDate,
        cardHolder: newCard.cardHolder,
        type: cardType
      }
    ]);
    setNewCard({
      cardHolder: '', cardNumber: '', expiryDate: '', cvc: '',
      address: '', city: '', state: '', zipCode: ''
    });
  };
  const handleDeleteCard = id =>
    setSavedCards(prev => prev.filter(c => c.id !== id));

  /* ===============================================================
     4) SAVED CLOTHES QUERY & STATE
  =============================================================== */
  const {
    data: savedClothes = [],
    isLoading: isLoadingSaved,
    isError: isErrorSaved,
    error: savedError
  } = useQuery({
    queryKey: ['savedClothes'],
    queryFn: getSavedClothes,
    enabled: activeTab === 'savedOutfits'
  });

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    if (activeTab === 'savedOutfits') {
      setFilteredData(savedClothes);
    }
  }, [savedClothes, activeTab]);

  const groupByCategoryAndType = items =>
    items.reduce((acc, item) => {
      const type = item.upper ? 'Uppers' : 'Lowers';
      const key = `${item.category} - ${type}`;
      (acc[key] = acc[key] || []).push(item);
      return acc;
    }, {});

  const renderSavedClothes = () => {
    if (isLoadingSaved) {
      return (
        <Box sx={{ p: 4 }}>
          <Skeleton width="40%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} />
        </Box>
      );
    }
    if (isErrorSaved) {
      return (
        <Typography color="error">
          Failed to load saved clothes: {savedError.message}
        </Typography>
      );
    }

    const groups = Object.entries(groupByCategoryAndType(filteredData));

    return groups.map(([groupName, items]) => {
      const unique = items.filter((it, i, arr) =>
        arr.findIndex(x => x.name === it.name) === i
      );
      const prefixMap = {
        SF_BL: 'Blazers',
        SF_DS: 'Dress Shirts',
        SF_JN: 'Jeans',
        SF_PT: 'Pants / Trousers',
        SF_PS: 'Polo Shirts',
        SF_SR: 'Shorts',
        SF_TS: 'T - Shirts'
      };
      let label = unique[0]?.category || '';
      for (const pre in prefixMap) {
        if (unique[0]?.name?.startsWith(pre)) {
          label = `${prefixMap[pre]} - ${unique[0].upper ? 'Uppers' : 'Lowers'}`;
          break;
        }
      }

      return (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: 28, fontWeight: 600, color: '#27374D', mb: 2 }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', px: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {unique.map(item => (
              <Box key={item._id} sx={{ flex: '0 0 auto', width: { xs: '85%', sm: '40%', md: '22%' }, minWidth: 200 }}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, transition: 'transform .3s', '&:hover': { transform: 'scale(1.05)', zIndex: 1 } }}>
                  <Box sx={{ p: 1, backgroundColor: '#fff' }}>
                    <CardMedia
                      component="img"
                      src={item.imageUrl}
                      height="260"
                      alt={item.name}
                      sx={{ objectFit: 'contain', cursor: 'pointer' }}
                      onClick={() => navigate(`/clothes/${item._id}`)}
                    />
                  </Box>
                  <Box sx={{ px: 1, py: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{ minWidth: 40, minHeight: 40, bgcolor: '#2D333A', borderRadius: 1, '&:hover': { bgcolor: '#1f2428' } }}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCartIcon />
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ minWidth: 40, minHeight: 40, bgcolor: '#2D333A', borderRadius: 1, '&:hover': { bgcolor: '#1f2428' } }}
                      onClick={() => handleUnsave(item._id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      );
    });
  };

  /* ===============================================================
     RENDER CONTENT SWITCH
  =============================================================== */
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
              <Box sx={styles.profilePictureSection}>
                <Avatar src={profileImage} sx={styles.profileAvatar}>
                  {!profileImage && 'UP'}
                </Avatar>
                <Box>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-photo">
                    <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} size="small">
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Box>
              {isEditing ? (
                <Box sx={styles.formSection}>
                  <Box sx={styles.nameFieldsContainer}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleUserInfoChange}
                      sx={styles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleUserInfoChange}
                      sx={styles.textField}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    sx={styles.textField}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    sx={styles.textField}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    name="bio"
                    value={userInfo.bio}
                    onChange={handleUserInfoChange}
                    sx={styles.textField}
                  />
                </Box>
              ) : (
                <Box sx={styles.infoDisplay}>
                  <Typography><b>Name:</b> {userInfo.firstName} {userInfo.lastName}</Typography>
                  <Typography><b>Email:</b> {userInfo.email}</Typography>
                  <Typography><b>Phone:</b> {userInfo.phone}</Typography>
                  <Typography><b>Bio:</b> {userInfo.bio}</Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={styles.contentFooter}>
              {isEditing ? (
                <Button variant="contained" onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
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
            {prefLoading && (
              <Box sx={{ p: 3 }}>
                <Skeleton width="40%" height={30} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={180} />
              </Box>
            )}
            {!prefLoading && !prefError && (
              <>
                <Box sx={styles.contentBody}>
                  <FormControl sx={{ mb: 3 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select value={gender} onChange={e => setGender(e.target.value)}>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Shirt Size</InputLabel>
                    <Select value={shirtSize} onChange={e => setShirtSize(e.target.value)}>
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Pant Size</InputLabel>
                    <Select value={pantSize} onChange={e => setPantSize(e.target.value)}>
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                  <Box>
                    <Typography sx={{ mb: 1 }}>Preferred Style</Typography>
                    {styleOptions.map(opt => (
                      <Chip
                        key={opt.id}
                        label={opt.name}
                        variant={stylePref === opt.id ? 'filled' : 'outlined'}
                        onClick={() => setStylePref(opt.id)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
                <Divider />
                <Box sx={styles.contentFooter}>
                  <Button
                    variant="contained"
                    disabled={savePrefs.isLoading}
                    onClick={() => savePrefs.mutate({
                      gender,
                      shirtSize,
                      pantSize,
                      stylePreference: stylePref
                    })}
                  >
                    {savePrefs.isLoading ? 'Saving…' : 'Save Preferences'}
                  </Button>
                </Box>
              </>
            )}
            {prefError && (
              <Typography sx={{ p: 3 }} color="error">
                Failed to load preferences.
              </Typography>
            )}
          </Paper>
        );

      case 'billing':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Billing</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your payment methods
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {savedCards.map(card => (
                <Paper key={card.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography><b>{card.type}</b></Typography>
                      <Typography>{card.cardNumber}</Typography>
                      <Typography variant="caption">
                        Expires {card.expiryDate} — {card.cardHolder}
                      </Typography>
                    </Box>
                    <IconButton color="error" onClick={() => handleDeleteCard(card.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ mb: 1 }}>Add New Payment Method</Typography>
                <TextField
                  fullWidth
                  sx={{ mb: 2 }}
                  label="Cardholder Name"
                  name="cardHolder"
                  value={newCard.cardHolder}
                  onChange={handleNewCardChange}
                />
                <TextField
                  fullWidth
                  sx={{ mb: 2 }}
                  label="Card Number"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleNewCardChange}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Expiry"
                    name="expiryDate"
                    value={newCard.expiryDate}
                    onChange={handleNewCardChange}
                  />
                  <TextField
                    fullWidth
                    label="CVC"
                    name="cvc"
                    value={newCard.cvc}
                    onChange={handleNewCardChange}
                  />
                </Box>
                <Button variant="contained" onClick={handleAddCard}>
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
                Your account settings
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              <Typography>— Email notifications</Typography>
              <Typography>— SMS notifications</Typography>
              <Typography>— Dark mode</Typography>
              <Typography>— Two-factor authentication</Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentFooter}>
              <Button variant="contained">Save Settings</Button>
            </Box>
          </Paper>
        );

      case 'savedOutfits':
        return (
          <Paper sx={styles.contentPaper}>
            <Box sx={styles.contentHeader}>
              <Typography variant="h5" sx={styles.contentTitle}>Saved Clothes</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage the clothes you’ve saved for later.
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {renderSavedClothes()}
            </Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  /* ===============================================================
     MAIN RENDER
  =============================================================== */
  return (
    <Box sx={styles.root}>
      <AppBar position="static" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 'none' }}>
        <Toolbar>
          <Typography
            variant="h4"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', transition: 'transform .2s', '&:hover': { transform: 'scale(1.03)' } }}
            onClick={() => navigate('/explore')}
          >
            Swipe-Fit
          </Typography>
          <IconButton onClick={() => navigate('/stylefeed')}>
            <PersonIcon />
          </IconButton>
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={() => navigate('/cart')}>
              <ShoppingCartIcon />
            </IconButton>
            {cartItems.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: '#FF5733',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                {cartItems.length}
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box sx={styles.mainContainer}>
          <Paper sx={styles.sidebar}>
            <List>
              {[
                { key: 'account',      icon: <PersonIcon />,      text: 'Account' },
                { key: 'preferences',  icon: <CheckroomIcon />,   text: 'Preferences' },
                { key: 'savedOutfits', icon: <FavoriteIcon />,    text: 'Saved Clothes' },
                { key: 'billing',      icon: <CreditCardIcon />,  text: 'Billing' },
                { key: 'settings',     icon: <SettingsIcon />,    text: 'Settings' }
              ].map(tab => (
                <ListItem disablePadding key={tab.key}>
                  <ListItemButton selected={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                    <ListItemIcon>{tab.icon}</ListItemIcon>
                    <ListItemText primary={tab.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Box sx={styles.contentArea}>
            {renderContent()}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

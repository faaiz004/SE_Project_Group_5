import React, { useState, useEffect, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Skeleton,
  Card,
  CardMedia
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

import {getSavedClothes}      from '../../api/clothesService'; 
import { styles }               from './styles';
import { unsaveClothes } from "../../api/clothesService";
import { getUserPreferences, updateUserPreferences } from '../../api/clothesService'; // Import from the newly created userService.js


const styleOptions = [
  { id: 'Modern',           name: 'Modern'    },
  { id: 'Smart_Casual',     name: 'Business'  },
  { id: 'Old_Money',        name: 'Old Money' },
  { id: 'Casual_Everyday',  name: 'Casual'    }
];

export default function Account() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  // === ACCOUNT INFO STATES & HANDLERS ===
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing]       = useState(true);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName : '',
    email    : '',
    phone    : '',
    bio      : ''
  });

  const handleUserInfoChange = (e) =>
    setUserInfo(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(f);
  };

  const [gender,    setGender]    = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [pantSize,  setPantSize]  = useState('');
  const [stylePref, setStylePref] = useState('');     

  const {
    data: fetchedPrefs = null,
    isLoading: prefLoading,
    isError  : prefError
  } = useQuery({
    queryKey : ['userPreferences'],
    queryFn  : getPreferences,
    enabled  : activeTab === 'preferences'
  });

  useEffect(() => {
    if (fetchedPrefs) {
      setGender     (fetchedPrefs.gender          ?? '');
      setShirtSize  (fetchedPrefs.shirtSize       ?? '');
      setPantSize   (fetchedPrefs.pantSize        ?? '');
      setStylePref  (fetchedPrefs.stylePreference ?? '');
    }
  }, [fetchedPrefs]);

  const savePrefs = useMutation({
    mutationFn : updatePreferences,
    onSuccess  : () => alert('Preferences saved!'),
    onError    : () => alert('Could not save preferences')
  });

  const {
    data      : savedClothes = [],
    isLoading : isLoadingSaved,
    isError   : isErrorSaved,
    error     : savedError
  } = useQuery({
    queryKey : ['savedClothes'],
    queryFn  : getSavedClothes,
    enabled  : activeTab === 'savedOutfits'
  });
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    if (activeTab === 'savedOutfits') {
      setFilteredData(savedClothes);
    }
  }, [savedClothes, activeTab]);
  

  const groupByCategoryAndType = (items) =>
    items.reduce((acc, it) => {
      const k = `${it.category} - ${it.upper ? 'Uppers' : 'Lowers'}`;
      (acc[k] = acc[k] || []).push(it);
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

    return groups.map(([grp, items]) => {
      const unique = items.filter((it, i, arr) =>
        arr.findIndex(x => x.name === it.name) === i
      );

      return (
        <Box key={groupName} sx={{ mb: 4 }}>
    <Typography sx={{ fontSize: 28, fontWeight: 600, color: "#27374D", mb: 2 }}>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {unique.map(item => (
          <Box
            key={item._id}
            sx={{
              flex: '0 0 auto',
              width: { xs: '85%', sm: '40%', md: '22%' },
              minWidth: 200
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)', zIndex: 1 }
              }}
            >
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
              <Box sx={{ px: 1, py: 1, display: "flex", gap: 1, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    bgcolor: "#2D333A",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": { bgcolor: "#1f2428" }
                  }}
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCartIcon />
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    bgcolor: "#2D333A",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": { bgcolor: "#1f2428" }
                  }}
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
  </Box>
      );
    });
  };

  const renderPreferences = () => (
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

  const renderContent = () => {
    switch (activeTab) {
      case 'preferences':  return renderPreferences();

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
              {/* Profile picture */}
              <Box sx={styles.profilePictureSection}>
                <Avatar src={profileImage} sx={styles.profileAvatar}>
                  {!profileImage && 'UP'}
                </Avatar>
                <Box>
                  <input id="upload-photo" type="file" accept="image/*"
                         style={{ display: 'none' }} onChange={handleImageUpload}/>
                  <label htmlFor="upload-photo">
                    <Button variant="outlined" component="span"
                            startIcon={<PhotoCameraIcon/>} size="small">
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Box>

              {isEditing ? (
                <Box sx={styles.formSection}>
                  <Box sx={styles.nameFieldsContainer}>
                    <TextField fullWidth label="First Name" name="firstName"
                               value={userInfo.firstName} onChange={handleUserInfoChange}
                               sx={styles.textField}/>
                    <TextField fullWidth label="Last Name"  name="lastName"
                               value={userInfo.lastName}  onChange={handleUserInfoChange}
                               sx={styles.textField}/>
                  </Box>
                  <TextField fullWidth label="Email"  name="email"
                             value={userInfo.email} onChange={handleUserInfoChange}
                             sx={styles.textField}/>
                  <TextField fullWidth label="Phone" name="phone"
                             value={userInfo.phone} onChange={handleUserInfoChange}
                             sx={styles.textField}/>
                  <TextField fullWidth multiline rows={3} label="Bio" name="bio"
                             value={userInfo.bio} onChange={handleUserInfoChange}
                             sx={styles.textField}/>
                </Box>
              ) : (
                <Box sx={styles.infoDisplay}>
                  <Typography><b>Name:</b>  {userInfo.firstName} {userInfo.lastName}</Typography>
                  <Typography><b>Email:</b> {userInfo.email}</Typography>
                  <Typography><b>Phone:</b> {userInfo.phone}</Typography>
                  <Typography><b>Bio:</b>   {userInfo.bio}</Typography>
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
                <Button variant="outlined" startIcon={<EditIcon/>}
                        onClick={() => setIsEditing(true)}>
                  Edit Information
                </Button>
              )}
            </Box>
          </Paper>
        );

      case 'preferences':
        return (
          // <Paper sx={styles.contentPaper}>
          //   <Box sx={styles.contentHeader}>
          //     <Typography variant="h5" sx={styles.contentTitle}>Preferences</Typography>
          //     <Typography variant="body2" color="text.secondary">
          //       Manage your clothing preferences and sizes
          //     </Typography>
          //   </Box>
          //   <Divider />
          //   <Box sx={styles.contentBody}>
          //     {/* Gender */}
          //     <FormControl sx={{ mb: 3 }}>
          //       <InputLabel>Gender</InputLabel>
          //       <Select value={gender} onChange={e => setGender(e.target.value)}>
          //         <MenuItem value="male">Male</MenuItem>
          //         <MenuItem value="female">Female</MenuItem>
          //       </Select>
          //     </FormControl>

          //     {/* Shirt Size */}
          //     <FormControl fullWidth sx={{ mb: 3 }}>
          //       <InputLabel>Shirt Size</InputLabel>
          //       <Select value={shirtSize} onChange={e => setShirtSize(e.target.value)}>
          //         <MenuItem value="s">Small</MenuItem>
          //         <MenuItem value="m">Medium</MenuItem>
          //         <MenuItem value="l">Large</MenuItem>
          //       </Select>
          //     </FormControl>

          //     {/* Pant Size */}
          //     <FormControl fullWidth sx={{ mb: 3 }}>
          //       <InputLabel>Pant Size</InputLabel>
          //       <Select value={pantSize} onChange={e => setPantSize(e.target.value)}>
          //         <MenuItem value="s">Small</MenuItem>
          //         <MenuItem value="m">Medium</MenuItem>
          //         <MenuItem value="l">Large</MenuItem>
          //       </Select>
          //     </FormControl>

          //     {/* Clothing Types */}
          //     <Box>
          //       <Typography sx={{ mb: 1 }}>Preferred Clothing Types</Typography>
          //       {['Modern','Business','Old Money','Casual'].map(type => (
          //         <Chip
          //           key={type}
          //           label={type}
          //           variant={selectedClothingTypes.includes(type) ? 'filled' : 'outlined'}
          //           onClick={() => handleClothingTypeClick(type)}
          //           sx={{ mr: 1, mb: 1 }}
          //         />
          //       ))}
          //     </Box>
          //   </Box>
          //   <Divider />
          //   <Box sx={styles.contentFooter}>
          //     <Button variant="contained">Save Preferences</Button>
          //   </Box>
          // </Paper>
          <Paper sx={styles.contentPaper}>
      <Box sx={styles.contentHeader}>
        <Typography variant="h5" sx={styles.contentTitle}>Preferences</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your clothing preferences and sizes
        </Typography>
      </Box>
      <Divider />
      <Box sx={styles.contentBody}>
        {/* Gender */}
        <FormControl sx={{ mb: 3 }}>
          <InputLabel>Gender</InputLabel>
          <Select value={gender} onChange={e => setGender(e.target.value)}>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        {/* Shirt Size */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Shirt Size</InputLabel>
          <Select value={shirtSize} onChange={e => setShirtSize(e.target.value)}>
            <MenuItem value="s">Small</MenuItem>
            <MenuItem value="m">Medium</MenuItem>
            <MenuItem value="l">Large</MenuItem>
          </Select>
        </FormControl>

        {/* Pant Size */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Pant Size</InputLabel>
          <Select value={pantSize} onChange={e => setPantSize(e.target.value)}>
            <MenuItem value="s">Small</MenuItem>
            <MenuItem value="m">Medium</MenuItem>
            <MenuItem value="l">Large</MenuItem>
          </Select>
        </FormControl>

        {/* Clothing Types */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ mb: 1 }}>Preferred Clothing Types</Typography>
          {['Modern', 'Business', 'Old Money', 'Casual'].map(type => (
            <Chip
              key={type}
              label={type}
              variant={selectedClothingTypes.includes(type) ? 'filled' : 'outlined'}
              onClick={() => handleClothingTypeClick(type)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </Box>
      <Divider />
      <Box sx={styles.contentFooter}>
        <Button variant="contained" onClick={handleSavePreferences}>
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
                Manage your payment methods
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.contentBody}>
              {/* Existing cards */}
              {savedCards.length ? savedCards.map(card => (
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
              )) : (
                <Typography>No payment methods saved yet.</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Add new card */}
              <Box>
                <Typography sx={{ mb: 1 }}>Add New Payment Method</Typography>
                <TextField
                  label="Cardholder Name"
                  name="cardHolder"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newCard.cardHolder}
                  onChange={handleNewCardChange}
                />
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newCard.cardNumber}
                  onChange={handleNewCardChange}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Expiry"
                    name="expiryDate"
                    fullWidth
                    value={newCard.expiryDate}
                    onChange={handleNewCardChange}
                  />
                  <TextField
                    label="CVC"
                    name="cvc"
                    fullWidth
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
              {/* Place your switches or other settings here */}
              <Typography>— Email notifications</Typography>
              <Typography>— SMS notifications</Typography>
              <Typography>— Dark mode</Typography>
              <Typography>— Two‑factor authentication</Typography>
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
            <Box sx={styles.contentBody}>{renderSavedClothes()}</Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={styles.root}>
      {/* Top App-bar */}
      <AppBar position="static" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h4" sx={{
            flexGrow: 1, fontWeight: 'bold', cursor: 'pointer',
            transition: 'transform .2s', '&:hover': { transform: 'scale(1.03)' }
          }} onClick={() => navigate('/explore')}>
            Swipe-Fit
          </Typography>
          <IconButton onClick={() => navigate('/stylefeed')}>
            <PersonIcon/>
          </IconButton>
          <IconButton onClick={() => navigate('/cart')}>
            <ShoppingCartIcon />
            {/* Display item count if there are any items in the cart */}
            {cartItems.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: '#FF5733',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              >
                {cartItems.length}
              </Box>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container maxWidth="xl">
        <Box sx={styles.mainContainer}>
          {/* Sidebar */}
          <Paper sx={styles.sidebar}>
            <List>
              {[
                { key: 'account',      icon: <PersonIcon/>,      text: 'Account'        },
                { key: 'preferences',  icon: <CheckroomIcon/>,   text: 'Preferences'    },
                { key: 'savedOutfits', icon: <FavoriteIcon/>,    text: 'Saved Clothes'  },
              ].map(tab => (
                <ListItem disablePadding key={tab.key}>
                  <ListItemButton selected={activeTab === tab.key}
                                  onClick={() => setActiveTab(tab.key)}>
                    <ListItemIcon>{tab.icon}</ListItemIcon>
                    <ListItemText primary={tab.text}/>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Dynamic content */}
          <Box sx={styles.contentArea}>{renderContent()}</Box>
        </Box>
      </Container>
    </Box>
  );
}

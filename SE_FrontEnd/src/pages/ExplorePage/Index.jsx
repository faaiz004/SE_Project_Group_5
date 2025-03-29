import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import {
    root
} from './Styles'


const ExplorePage = () => {
  return (
    <Box sx={root}>
        <Container>
            <Typography variant="h4" gutterBottom>
            Explore Page
            </Typography>
        </Container>
    </Box>
  );
};

export default ExplorePage;
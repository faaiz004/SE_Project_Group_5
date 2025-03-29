import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const StyleFeedPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Style Feed Page
      </Typography>
      <Grid container spacing={3}>
        {/* Example cards for style feed */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/150"
              alt="Style Image"
            />
            <CardContent>
              <Typography variant="h6">Style Title</Typography>
              <Typography variant="body2" color="text.secondary">
                This is a description of the style.
              </Typography>
            </CardContent>
            <Button size="small" color="primary">
              View Details
            </Button>
          </Card>
        </Grid>
        {/* Add more cards as needed */}
      </Grid>
    </Container>
  );
};

export default StyleFeedPage;
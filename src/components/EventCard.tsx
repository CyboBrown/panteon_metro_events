import { Card, CardContent, Typography, Button } from '@mui/material';
import { useState } from 'react';

const EventCard = ( {eventName, description, startTime, endTime }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
  return (
    <>
    <Card  variant="outlined" sx={{ minWidth: 275, maxWidth: 350, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">{eventName}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">{description}</Typography>
        <Typography variant="body1" color="text.secondary">Start Time: {startTime}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2}}>End Time: {endTime}</Typography>
        <Button variant="contained" color="primary" sx={{ mr: 1}}> Review </Button>
        <Button variant="contained" color="secondary" sx={{ mr: 1}}> Edit </Button>
        <Button variant="contained" color="error"> Cancel </Button>
      </CardContent>
    </Card>
    </>
  );
};

export default EventCard;

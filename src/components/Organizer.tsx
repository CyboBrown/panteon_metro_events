import { TextField, Button, Grid, Typography, Box, Modal} from '@mui/material';
import { useEffect, useState } from 'react';
import { createEvent, getOrganizer, getOrganizerEvents } from '../operations';
import EventCard from './EventCard';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default function Organizer({token}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [user, setUser] = useState('');
  const [orgList, setOrgList] = useState([])
 

  const getOrganizerID = () => {
    getOrganizer(token.user.id)
        .then(organizer => {
            setUser(organizer[0]); 
        })
        .catch(console.error);
  };

  const getEventList = () => {
      getOrganizerEvents(user.id)
          .then(orgEventList => {
              setOrgList(orgEventList);
          })
          .catch(console.error);
  };
  
  useEffect(() => {
    getOrganizerID();
  }, [token])

  useEffect(() => {
    getEventList();
  }, [user])

  useEffect(() => {
    getEventList();
  },[orgList])

  const handleListUpdate = () => {
    getEventList(); 
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    createEvent(eventName, eventDescription, eventStartDate, eventEndDate, user.id)
      .then(() =>
        getEventList())
    setEventName('');
    setEventDescription('');
    setEventStartDate('');
    setEventEndDate('');
    handleClose();
    e.preventDefault();
  };
  
    return (
    <>
      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center">
          <Typography variant="h3">Event List</Typography>
          
          {orgList ? (
            <Grid container spacing={-1} justifyContent="center">
            {orgList.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <EventCard 
                  eventName={event.name}
                  description={event.description}
                  startTime={event.event_start}
                  endTime={event.event_end}
                  eventID={event.id}
                  isCancelled={event.is_cancelled}
                  updateList={handleListUpdate}/>
              </Grid>
            ))}
            </Grid>) : ''}

          <Button variant="contained" sx={{mt: 10}}onClick={handleOpen}>Create Event</Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <Typography variant="h4" align="center" gutterBottom> Create Event </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField required label="Event Name" fullWidth
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required label="Event Description" multiline fullWidth
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required label="Starting Date and Time" type="datetime-local"
                      fullWidth value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      InputLabelProps={{shrink: true}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required label="Ending Date and Time" type="datetime-local"
                      fullWidth value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      InputLabelProps={{shrink: true}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth> Create Event </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Modal>
      </Grid>
    </>
  );
}

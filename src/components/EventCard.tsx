import { Card, CardContent, Typography, Button, Modal, TextField, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { cancelEvent, getAttendees, getUser, respondJoinRequest, updateEvent } from '../operations';

const EventCard = ({eventName, description, startTime, endTime, eventID, isCancelled, updateList}) => {
  const [openCancel, setOpenCancel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [eventNameEdit, setEventNameEdit] = useState(eventName);
  const [eventDescriptionEdit, setEventDescriptionEdit] = useState(description);
  const [eventStartDateEdit, setEventStartDateEdit] = useState(startTime);
  const [eventEndDateEdit, setEventEndDateEdit] = useState(endTime);
  const [eventAttendee, setEventAttendee] = useState([]);
  const [reviewed, setReviewed] = useState(false);

  const getEventAttendees = () => {
    getAttendees(eventID).then(attendee => {
      setEventAttendee(attendee);
    })
    .catch(console.error);
  }

  useEffect(() => {
    getEventAttendees();
  }, [eventID, reviewed])

  const handleCancelOpen = () => setOpenCancel(true);
  const handleCancelClose = () => setOpenCancel(false);
  const handleEditOpen = () => {
    setEventNameEdit(eventName);
    setEventDescriptionEdit(description);
    setEventStartDateEdit(startTime);
    setEventEndDateEdit(endTime);
    setOpenEdit(true);
  };
  const handleEditClose = () => setOpenEdit(false);
  const handleReviewOpen = () => setOpenReview(true);
  const handleReviewClose = () => setOpenReview(false);

  const handleCancelEvent = () => {
    cancelEvent(eventID, true, cancelReason);
    handleCancelClose();
    updateList();
  };

  const handleAcceptReview = (id) => {
    respondJoinRequest(id,eventID, true);
    setReviewed(true);
    updateList();
  };

  const handleDeclineReview = (id) => {
    respondJoinRequest(id,eventID, false);
    setReviewed(true);
    updateList();
  };
  
  const handleEditSubmit = (event) => {
    event.preventDefault();
    updateEvent(eventID, eventNameEdit, eventDescriptionEdit,eventStartDateEdit, eventEndDateEdit)
    handleEditClose();
    updateList();
  };
 
  return (
    <>
      <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 350, margin: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">{eventName}</Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">{description}</Typography>
          <Typography variant="body1" color="text.secondary">Start Time: {startTime}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>End Time: {endTime}</Typography>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleReviewOpen}>Review</Button>
          <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={handleEditOpen}>Edit</Button>
          {isCancelled ? (<Button variant="outlined" color="error" disabled>Cancelled</Button>) : (<Button variant="contained" color="error" onClick={handleCancelOpen}>Cancel</Button>)}
        </CardContent>
      </Card>

      {/* Popups cancel, edit, review */}
      <Modal open={openCancel} onClose={handleCancelClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Cancel {eventName}?</Typography>
          <TextField label="Please input the reason for cancellation"fullWidth 
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}/>
          <Button variant="contained" color="primary" onClick={handleCancelEvent} sx={{ mt: 2 }}>Cancel Event</Button>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={handleEditClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>Edit Event</Typography>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required label="Event Name" fullWidth 
                  value={eventNameEdit}
                  onChange={(e) => setEventNameEdit(e.target.value)}/>
              </Grid>
              <Grid item xs={12}>
                <TextField required label="Event Description" multiline fullWidth 
                  value={eventDescriptionEdit}
                  onChange={(e) => setEventDescriptionEdit(e.target.value)}/>
              </Grid>
              <Grid item xs={12}>
                <TextField required label="Starting Date and Time" type="datetime-local"fullWidth
                  value={eventStartDateEdit}
                  onChange={(e) => setEventStartDateEdit(e.target.value)}/>
              </Grid>
              <Grid item xs={12}>
                <TextField required label="Ending Date and Time" type="datetime-local" fullWidth
                  value={eventEndDateEdit}
                  onChange={(e) => setEventEndDateEdit(e.target.value)}/>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>Update Event</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Modal open={openReview} onClose={handleReviewClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h5">Review Request</Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {eventAttendee.length == 0 ? 
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No requests for this event</TableCell>
                </TableRow> 
                : eventAttendee.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.id}</TableCell>
                    {user.is_accepted !== null ? 
                      <TableCell align="center">User has been reviewed</TableCell>
                      : <TableCell align="center">
                        <Button variant="contained" color="primary" onClick={() => handleAcceptReview(user.user_id)}>Accept</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDeclineReview(user.user_id)}>Decline</Button>
                        </TableCell>}
                  </TableRow>
                )) }
                
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </>
  );
};

export default EventCard;

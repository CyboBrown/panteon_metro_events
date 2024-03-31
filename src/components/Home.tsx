import { Button, Card, CardContent, Grid, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import Upvote from "@mui/icons-material/ThumbUpOutlined";
import ResponsiveAppBar from "./ResponsiveAppBar";
import IconButton from "@mui/material/IconButton";
import {
  getNotifs,
  requestOrganizer,
  isOrganizer,
  requestAdministrator,
  getEvents,
  formatDate,
  requestJoinEvent,
  setNotification,
  getEvent,
  createNotif,
  isApproved,
  isNotified,
  isAdministrator,
} from "../operations";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../client";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import List from "@mui/material";
import "./Home.css";
import { Typography } from "@mui/material";

//subject to change (ids and event redirect/popup/data)
interface Notif {
  title: string;
  description: string;
}

interface HomeProps {
  token: any;
}

const CardWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
});

const CardContainer = styled("div")({
  backgroundColor: "#f0f0f0",
  width: "250px",
  height: "200px",
  textAlign: "center",
});

const Home: React.FC<HomeProps> = ({ token }) => {
  const [notifNumber, setNotifNumber] = useState(0);
  const [isOrganizerStatus, setIsOrganizerStatus] = useState(null);
  const [isAdministratorStatus, setAdministratorStatus] = useState(null);
  const [notifList, setNotifList] = useState<Notif[]>([]);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const handleInserts = (payload: any) => {
    console.log("Change received!", payload);
    const newNotification = payload?.new;
    if (newNotification) {
      const isDuplicate = notifList.some(
        (notification) =>
          notification.title === newNotification.title &&
          notification.description === newNotification.description
      );
      if (!isDuplicate) {
        setNotifList((prevList) => [
          ...prevList,
          {
            title: newNotification.title,
            description: newNotification.description,
          },
        ]);
        setNotifNumber((prevNumber) => prevNumber + 1);
      }
    }
  };

  supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      handleInserts
    )
    .subscribe();

  useEffect(() => {
    const processedEventIds = new Set<number>();

    isNotified(token.user.id)
      .then(async (eventIds: any[]) => {
        for (const eventId of eventIds) {
          const { event_id, is_accepted } = eventId;

          if (processedEventIds.has(event_id)) {
            console.log(
              "Event ID",
              event_id,
              "already processed. Skipping notification creation."
            );
            continue;
          }

          console.log("Fetching event details for event ID:", event_id);
          const eventDetailsArray = await getEvent(event_id);
          console.log("Event Details Array:", eventDetailsArray);

          if (eventDetailsArray.length > 0) {
            eventDetailsArray.forEach((eventDetail: any) => {
              const { name, event_start } = eventDetail;
              console.log("Event Request Update");
              createNotif(
                "Event Request Update",
                "Your request to join " +
                  name +
                  " on " +
                  formatDate(event_start) +
                  " has been accepted.",
                token.user.id
              );
              setNotification(token.user.id, event_id);
              processedEventIds.add(event_id); // Add event ID to processed set
            });
          } else {
            console.error("No event details found for event ID:", event_id);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching eventIds:", error.message);
      });
  }, [token.user.id]);

  useEffect(() => {
    const fetchOrganizerStatus = async () => {
      try {
        const status = await isOrganizer(token.user.id);
        setIsOrganizerStatus(status);
      } catch (error) {
        console.error("Error checking organizer status:", error);
        setIsOrganizerStatus(null);
      }
    };

    fetchOrganizerStatus();
  }, [token.user.id]);

  //needs editing
  useEffect(() => {
    const fetchAdministratorStatus = async () => {
      try {
        const status = await isAdministrator(token.user.id);
        setAdministratorStatus(status);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdministratorStatus(null);
      }
    };

    fetchAdministratorStatus();
  }, [token.user.id]);

  useEffect(() => {
    getNotifs(token.user.id).then((data) => {
      setNotifList(data);
      //ignore typescript things
    });
  }, []);

  //For notif button callback see ".SimpleBadge.tsx Line 23"
  const clearNotif = () => {
    setNotifNumber(0);
  };

  //Add a notificaiton
  const addNotif = (t: string, d: string) => {
    const newNotif: Notif = {
      title: t,
      description: d,
    };
    setNotifList([...notifList, newNotif]);
    console.log("Added new event notif");
  };

  //show events on home and formatting the date
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(
          eventsData.map((event) => ({
            ...event,
            event_start: formatDate(event.event_start),
          }))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  //Debugging
  useEffect(() => {
    console.log("Notif List: {");
    console.log(notifList);
    console.log("}");
  }, [notifList]);

  //
  const handleBecomeOrganizer = async () => {
    const response = await requestOrganizer(token.user.id);
    console.log(response);
    if ((await isOrganizer(token.user.id)) == true) {
      const notif = await createNotif(
        "User Status",
        "Request to to become an Organizer has been accepted!",
        token.user.id
      );
      alert("You are already an organizer!");
    } else if ((await isOrganizer(token.user.id)) == false) {
      setNotifNumber(notifNumber + 1);
      const notif = await createNotif(
        "User Status",
        "Request to to become an Organizer has been rejected!",
        token.user.id
      );
    } else if ((await isOrganizer(token.user.id)) == null) {
      alert("Request is currently being reviewed. Please wait for approval.");
    } else if (response) {
      alert("Request to become an organizer has been submitted for approval.");
    } else {
      alert("Request already sent! Please wait for approval.");
    }
  };

  const handleJoinEvent = async (index: number) => {
    const eventIds = events.map((event) => event.id);
    const userUUID = token.user.id;
    const response = await requestJoinEvent(userUUID, eventIds[index]);
    console.log(response);
    console.log(eventIds[index] + " , " + userUUID);
    if (response) {
      alert("Request to join event has been submitted for approval.");
    } else {
      alert("Request already sent! Please wait for approval.");
    }
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <ResponsiveAppBar
        notifNumber={notifNumber}
        callBackClearNotif={clearNotif}
        notifList={notifList}
      />
      <div className="dashboard">
        <h1>{"Welcome, " + token.user.user_metadata.first_name}</h1>
        <div>
          {isAdministratorStatus === true && <p>You are an admin.</p>}
          {isAdministratorStatus === false && <p>You are not an admin.</p>}
          {isAdministratorStatus === null && (
            <p>Admin request waiting for approval.</p>
          )}
        </div>
        <div>
          {isOrganizerStatus === true && <p>You are an organizer.</p>}
          {isOrganizerStatus === false && <p>You are not an organizer.</p>}
          {isOrganizerStatus === null && (
            <p>Organizer request waiting for approval.</p>
          )}
        </div>
        <div>
          {!isOrganizerStatus && (
            <Button
              variant="contained"
              onClick={handleBecomeOrganizer}
              sx={{ mt: 5 }}
            >
              Become an Organizer
            </Button>
          )}
          {isOrganizerStatus && (
            <Link to="/organizer">
              <Button variant="contained" sx={{ mt: 5 }}>
                Go to Events List
              </Button>
            </Link>
          )}
          {isAdministratorStatus && (
            <Link to="/admin" style={{ marginLeft: "10px" }}>
              <Button variant="contained" sx={{ mt: 5 }}>
                Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="dashboard">
        <Grid
          container
          spacing={8}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {currentEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CardContainer
                sx={{
                  mb: 1,
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "6px",
                  boxSizing: "border-box",
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    <h2>{event.name}</h2>
                  </Typography>
                  <Typography>
                    <p>Event Start: {event.event_start}</p>
                  </Typography>
                  <Typography>
                    <p>Description: {event.description}</p>
                  </Typography>
                </CardContent>
              </CardContainer>
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  variant="contained"
                  onClick={() => handleJoinEvent(index)}
                  sx={{ mt: 0 }}
                >
                  Join Event
                </Button>
                {/* <Button
                  variant="contained"
                  disabled
                  onClick={() => handleJoinEvent(index)}
                  sx={{ mt: 0 }}
                >
                <p>Upvote Now   </p>
                </Button> */}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          padding: "0 20px",
          border: "10px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentEvents.length < eventsPerPage}
        >
          Next
        </Button>
      </div>
    </>
  );
};
export default Home;

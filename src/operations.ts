import { supabase } from "./client";

// Ari ibutang ang CRUD stuff

// TODO: (insert lacking functions here, in comments)

// set an event as cancelled
export const cancelEvent = async (
  event_id: string,
  is_cancelled: boolean,
  reason_for_cancellation: string
) => {
  const { data, error } = await supabase
    .from("events")
    .update({
      is_cancelled: is_cancelled,
      reason_for_cancellation: reason_for_cancellation,
    })
    .eq("id", event_id)
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// create an event and add event details
export const createEvent = async (
  name: string,
  description: string,
  event_start: string,
  event_end: string,
  created_by: number,
) => {
  // You can add more event information here (and in supabase)
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        name: name,
        description: description,
        event_start: event_start,
        event_end: event_end,
        created_by: created_by,
      },
    ])
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// send notifications to user
export const createNotif = async (
  title: string,
  description: string,
  target_user: string
) => {
  // You can add more event information here (and in supabase)
  const { data, error } = await supabase
    .from("notifications")
    .upsert([
      {
        title: title,
        description: description,
        user_id: target_user,
      },
    ])
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch all attendees of the specified event
export const getAttendees = async (event_id: number) => {
  let { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("event_id", event_id)
    .order("created_at", { ascending: false });
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch event details by event_id
export const getEvent = async (event_id: number) => {
  let { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id);
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch all events
export const getEvents = async () => {
  let { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_cancelled", false)
    .order("created_at", { ascending: false });
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch user details by user_id
export const getUser = async (user_id: string) => {
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user_id)
    .single();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch all user requesting for organizer role
export const getOrganizerApplicants = async () => {
  let { data, error } = await supabase
    .from("organizers")
    .select("*")
    .eq("is_accepted", false)
    .order("created_at", { ascending: false });
  if (error) console.log("CRUD Error: " + error);
  return data;
};

export const getAdministratorApplicants = async () => {
  let { data, error } = await supabase
    .from("administrators")
    .select("*")
    .eq("is_accepted", false)
    .order("created_at", { ascending: false });
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch all notifications for the specified user
export const getNotifs = async (user_id: string) => {
  let { data, error } = await supabase
    .from("notifications")
    .select("title,description")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// fetch organizer details
export const getOrganizer = async (user_id: string) => {
  let { data, error } = await supabase
    .from("organizers")
    .select("id")
    .eq("user_id", user_id)
  if (error) console.log("CRUD Error: " + error);
  return data;
}

// user requests for administrator role
export const requestAdministrator = async (user_id: string) => {
  const { data, error } = await supabase
    .from("administrators")
    .upsert([{ user_id: user_id }])
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// user requests to join event
export const requestJoinEvent = async (user_id: string, event_id: number) => {
  const { data, error } = await supabase
    .from("attendees")
    .upsert([{ user_id: user_id, event_id: event_id }])
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// user requests for organizer role
export const requestOrganizer = async (user_id: string) => {
  const { data, error } = await supabase
    .from("organizers")
    .upsert([{ user_id: user_id }])
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// administrator responds (deny or accept) to user request to be administrator
export const respondAdministratorRequest = async (
  user_id: string,
  is_accepted: boolean
) => {
  const { data, error } = await supabase
    .from("administrators")
    .update({
      is_accepted: is_accepted,
    })
    .eq("user_id", user_id)
    .select();
  if (is_accepted) {
    const { data, error } = await supabase
      .from("users")
      .update({
        is_administrator: true,
      })
      .eq("auth_user_id", user_id);
  }
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// organizer responds (deny or accept) to join request
export const respondJoinRequest = async (
  user_id: string,
  event_id: number,
  is_accepted: boolean
) => {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      is_accepted: is_accepted,
    })
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// administrator responds (deny or accept) to user request to be organizer
export const respondOrganizerRequest = async (
  user_id: string,
  is_accepted: boolean
) => {
  const { data, error } = await supabase
    .from("organizers")
    .update({
      is_accepted: is_accepted,
    })
    .eq("user_id", user_id)
    .select();
  if (is_accepted) {
    const { data, error } = await supabase
      .from("users")
      .update({
        is_organizer: true,
      })
      .eq("auth_user_id", user_id);
  }
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// add reviews to an event (requires user to join event)
export const reviewEvent = async (
  user_id: string,
  event_id: number,
  review: string
) => {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      review: review,
      reviewed_at: new Date().toISOString().toLocaleString(),
    })
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// update event details
export const updateEvent = async (
  event_id: number,
  name: string,
  description: string,
  event_start: string
) => {
  const { data, error } = await supabase
    .from("events")
    .update({ name: name, description: description, event_start: event_start })
    .eq("event_id", event_id)
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

// upvote an event (requires user to join event first)
export const upvoteEvent = async (user_id: string, event_id: number) => {
  const { data, error } = await supabase
    .from("attendees")
    .update({ has_upvoted: true })
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .select();
  if (error) console.log("CRUD Error: " + error);
  return data;
};

export const isOrganizer = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("organizers")
      .select("is_accepted")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.log("CRUD Error: " + error.message);
      return false;
    }
    if (data) {
      if (data.is_accepted === true) {
        return true;
      } else if (data.is_accepted === false) {
        return false;
      } else {
        return null;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
};

export const formatDate = (dateString: Date) => {
  const eventStartDate = new Date(dateString);
  return eventStartDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export const isApproved = async (user_id: string) => {
  const { data, error } = await supabase
    .from("attendees")
    .select("event_id")
    .eq("user_id", user_id)
    .eq("is_accepted", true);

  if (error) {
    console.log("CRUD Error: " + error.message);
    return null;
  }

  if (data) {
    return data.map((row: any) => row.event_id);
  }

  return [];
};

export const isNotified = async (user_id: string) => {
  const { data, error } = await supabase
    .from("attendees")
    .select("event_id")
    .eq("user_id", user_id)
    .eq("notified", false)
    .eq("is_accepted", true);

  if (error) {
    console.log("CRUD Error: " + error.message);
    return null;
  }

  if (data) {
    return data.map((row: any) => ({
      event_id: row.event_id,
      is_accepted: row.is_accepted,
    }));
  }

  return [];
};

export const setNotification = async (user_id: string, event_id: string) => {
  const { data, error } = await supabase
    .from("attendees")
    .update({ notified: true })
    .eq("user_id", user_id)
    .eq("event_id", event_id);
  if (error) console.log("CRUD Error: " + error);
  return data;
};

export const isAdministrator = async (user_id: string): Promise<boolean | null> => {
  try {
    const { data, error } = await supabase
      .from("administrators")
      .select("is_accepted")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.log("CRUD Error: " + error.message);
      return false;
    }
    if (data) {
      if (data && data.is_accepted === true) {
        return true;
      } else if (data && data.is_accepted === false) {
        return false;
      } else {
        return false;
      } 
    }
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
};
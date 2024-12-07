import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/communityUser.css";
import { SERVER_PATHNAME } from "@utils/urls";

// Fetch all events
const fetchEvents = async (token: string) => {
  const response = await axios.get(`${SERVER_PATHNAME}/api/events/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// RSVP to an event
const rsvpEvent = async ({
  eventId,
  token,
}: {
  eventId: string;
  token: string;
}) => {
  const response = await axios.post(
    `${SERVER_PATHNAME}/api/events/${eventId}/signup`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

const EventsUser = () => {
  const { token, id } = useSelector((state: any) => state.auth);

  const queryClient = useQueryClient();

  // State for notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch events
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(token),
  });

  // Mutation to RSVP to an event
  const mutation = useMutation({
    mutationFn: (variables: { eventId: string }) =>
      rsvpEvent({ eventId: variables.eventId, token }),
    onSuccess: (data) => {
      // Invalidate events query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["events"] });

      // Optionally, manually update the events state to reflect the RSVP
      setSuccessMessage("Successfully RSVP'd to the event");

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      console.error("Error RSVPing to event:", error);
    },
  });

  if (isLoading) {
    return <div className="flex">Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching events:", error);
    return <div className="flex">Something went wrong...</div>;
  }

  // Filter events based on the current user's attendance
  const attendingEvents = data.filter((event: any) =>
    event.attendees?.some((attendee: any) => attendee._id === id),
  );
  const availableEvents = data.filter(
    (event: any) =>
      !event.attendees?.some((attendee: any) => attendee._id === id),
  );

  return (
    <div className="main-container">
      {/* Notification */}
      {successMessage && <div className="alert success">{successMessage}</div>}

      {/* Attending Events */}
      <div className="section-container">
        <div className="section-title">Attending Events</div>
        <div className="cards-container">
          {!attendingEvents.length && <div>No events</div>}
          {!!attendingEvents.length &&
            attendingEvents.map((event: any, index: any) => (
              <div className="card" key={index}>
                <div className="card-title">{event.resource}</div>
                <div className="card-description">
                  {new Date(event.start).toLocaleString()} -{" "}
                  {new Date(event.end).toLocaleString()}
                </div>
                <div className="card-location">Location: {event.location}</div>
                <div className="card-members">
                  {event?.attendees.length} members
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Available Events */}
      <div className="section-container">
        <div className="section-title">Explore New Events</div>
        <div className="cards-container">
          {!availableEvents.length && <div>No events available</div>}
          {!!availableEvents.length &&
            availableEvents.map((event: any, index: any) => (
              <div className="card" key={index}>
                <div className="card-title">{event.resource}</div>
                <div className="card-description">
                  {new Date(event.start).toLocaleString()} -{" "}
                  {new Date(event.end).toLocaleString()}
                </div>
                <div className="card-location">Location: {event.location}</div>
                <div className="card-members">
                  {event?.attendees.length} attendees
                </div>
                <button
                  className="join-button"
                  onClick={() => mutation.mutate({ eventId: event._id })}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Joining..." : "RSVP"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventsUser;

import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import { EventCard } from "../components/EventCard";
import { useSelector } from "react-redux";
import { SERVER_PATHNAME } from "@utils/urls";
import "../styles/eventPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: any) => state.auth);

  // Fetch events from the API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_PATHNAME}/api/events/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch events.");
      setLoading(false);
    }
  };

  // Fetch events when the page loads
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      const response = await axios.delete(
        `${SERVER_PATHNAME}/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        alert("Event deleted successfully");
        // Update the events state by removing the deleted event
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId),
        );
      }
    } catch (error) {
      console.error("Failed to delete event", error);
      alert("Failed to delete event");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="main-container">
      {loading && <div className="loader">Loading Events...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && events.length === 0 && (
        <div className="no-events">No events found.</div>
      )}
      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;

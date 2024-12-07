import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SERVER_PATHNAME } from "@utils/urls";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import "../styles/createEventPage.css";

const CreateEventPage = () => {
  const { token } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  // const [status, setStatus] = useState("CheckedIn");
  const [status, setStatus] = useState("CheckedIn");
  const [location, setLocation] = useState("");
  const [resource, setResource] = useState("");
  const [address, setAddress] = useState("");
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !resource || !address || !start || !end) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);

    const eventData = {
      status,
      location,
      resource,
      address,
      start,
      end,
    };

    try {
      await axios.post(`${SERVER_PATHNAME}/api/events/create`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      setMessage("Event created successfully!");
      setLocation("");
      setResource("");
      setAddress("");
      setStart(null);
      setEnd(null);

      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setMessage("Error creating event. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-event-container">
      <Box className="add-event-box">
        <Typography variant="h4" className="page-title">
          Add a New Event
        </Typography>
        <form onSubmit={handleSubmit} className="event-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Event Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Resource (e.g., Dr. Test)"
                value={resource}
                onChange={(e) => setResource(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Event Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Time"
                type="datetime-local"
                value={start || ""}
                onChange={(e) => setStart(e.target.value || null)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="End Time"
                type="datetime-local"
                value={end || ""}
                onChange={(e) => setEnd(e.target.value || null)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={
                  loading ||
                  !location ||
                  !resource ||
                  !address ||
                  !start ||
                  !end
                }
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </Grid>
          </Grid>
        </form>
        {message && (
          <Typography variant="body1" className="message">
            {message}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default CreateEventPage;

import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import "../styles/eventCard.css";

interface EventCardProps {
  event: {
    _id: string;

    resource: string;

    location: string;

    start: string;

    end: string;

    status: string;
  };

  onDelete: (eventId: string) => void;
}

export const EventCard = ({ event, onDelete }: EventCardProps) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        backgroundColor: "#ffffff",
        margin: "15px",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#034752",
          }}
        >
          {event.resource}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: "10px", color: "#666" }}
        >
          {event.location}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: "10px", color: "#666" }}
        >
          {new Date(event.start).toLocaleString()} -{" "}
          {new Date(event.end).toLocaleString()}
        </Typography>
        {/* <Typography
          variant="body2"
          sx={{
            fontSize: "0.9rem",
            fontWeight: "500",
            color: event.status === "active" ? "#28a745" : "#dc3545",
          }}
        >
          Status: {event.status}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => onDelete(event._id)}
          sx={{
            fontSize: "0.85rem",
            padding: "5px 15px",
            borderRadius: "5px",
          }}
        >
          Delete Event
        </Button>
      </CardActions>
    </Card>
  );
};

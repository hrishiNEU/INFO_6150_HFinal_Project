import Event from "../models/Event.js";
import User from "../models/User.js";

// Create a new event
export const createEvent = async (req, res) => {
  const { status, location, resource, address, start, end } = req.body;
  if (req.user.role !== "BusinessOwner") {
    return res.status(403).json({
      message: "Unauthorized: Only BusinessOwners can create events.",
    });
  }

  if (!location || !start || !end) {
    return res.status(400).json({ message: "Inadequate Information" });
  }
  const userId = req.user._id;

  try {
    const event = await Event.create({
      status,
      location,
      resource,
      address,
      start,
      end,
      createdBy: userId,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update Event
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { status, location, resource, address, start, end } = req.body;

  if (req.user.role !== "BusinessOwner") {
    return res.status(403).json({
      message: "Unauthorized: Only BusinessOwners can update events.",
    });
  }

  if (
    !eventId ||
    (!status && !location && !resource && !address && !start && !end)
  ) {
    return res.status(400).json({ message: "Inadequate Information." });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status, location, resource, address, start, end },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  if (req.user.role !== "BusinessOwner") {
    return res.status(403).json({
      message: "Unauthorized: Only BusinessOwners can delete events.",
    });
  }

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    // Find the event first to check ownership
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the logged-in user is the creator of the event
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete events you created.",
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email profileImage")
      .populate("attendees", "name email profileImage");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Event by EventId
export const getEventByEventId = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId)
      .populate("createdBy", "name email profileImage")
      .populate("attendees", "name email profileImage");
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign up for an event
export const signupForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already signed up for this event" });
    }

    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: "Signed up successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventsByOwner = async (req, res) => {
  const userId = req.user._id;

  try {
    // Query events where createdBy matches the userId
    const events = await Event.find({ createdBy: userId }).populate(
      "attendees",
      "name email profileImage"
    );

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this user." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

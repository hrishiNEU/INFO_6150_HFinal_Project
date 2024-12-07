import Contact from "../models/Contact.js";

const saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save contact to database
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default saveContact;
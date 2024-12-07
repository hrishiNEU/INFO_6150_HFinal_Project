import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SERVER_PATHNAME } from "@utils/urls";
import "../styles/addCommunityPage.css"; // Add custom styles

const AddCommunityPage = () => {
  const { token } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${SERVER_PATHNAME}/api/community/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setMessage("Community created successfully!");

      // Clear the input fields after successful submission
      setName("");
      setDescription("");
      setImage(null);

      setTimeout(() => {
        navigate("/communityAdminPage"); // Redirect after 2 seconds
      }, 2000);
    } catch (error) {
      setLoading(false);
      setMessage("Error creating community. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-community-container">
      <h1 className="page-title">Add a New Community</h1>
      <form onSubmit={handleSubmit} className="community-form">
        <div className="form-group">
          <label htmlFor="name">Community Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter community description"
            className="form-input"
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Community Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading || !name || !description}
        >
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddCommunityPage;

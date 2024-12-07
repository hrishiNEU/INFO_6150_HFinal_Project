import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // To access the token from Redux store
import "../styles/communityDetails.css";
import { SERVER_PATHNAME } from "@utils/urls";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface Member {
  _id: string;
  userId: User;
  status: "approved" | "pending";
}

interface Community {
  _id: string;
  name: string;
  description: string;
  image:string;
  members: Member[];
}

const CommunityDetails = () => {
  const { communityId } = useParams<{ communityId: string }>(); // Specify type for communityId
  const [community, setCommunity] = useState<Community | null>(null); // Use the Community type
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Access the token from Redux store
  const token = useSelector((state: any) => state.auth.token); // Make sure to specify the correct type for Redux state

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await axios.get(
          `${SERVER_PATHNAME}/api/community/${communityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the header
            },
          }
        );
        setCommunity(response.data);
        console.log(response.data) // Set the community data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching community details:", error);
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunityDetails();
    }
  }, [communityId, token]);

  const handleMemberAction = async (userId: string, action: "approve" | "reject" | "remove") => {
    try {
      console.log("Details:",userId,action)
      const response = await axios.put(
        `${SERVER_PATHNAME}/api/community/${communityId}/members`,
        { action, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the header
          },
        }
      );
      console.log("response",response)
      // After action, refetch the community data
      console.log("Community",response.data.community)
      setCommunity(response.data.community);
    } catch (error) {
      console.error("Error performing member action:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${SERVER_PATHNAME}/api/community/${communityId}/uploadCommunityImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCommunity(response.data.community); // Update the community with the new image
      setIsEditingImage(false); // Close the edit mode
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingImage(false);
    setImage(null); // Reset the selected image
  };


  if (loading) {
    return <p>Loading community details...</p>;
  }

  if (!community) {
    return <p>Community not found.</p>;
  }

return (
  <div className="community-details-container">
    {/* Community Image */}
    <div className="community-image">
      <img
        src={`${SERVER_PATHNAME}/${community.image}`}
        alt={community.name}
        className="community-image-img"
      />
       {/* Pencil Icon to Edit Image */}
        {!isEditingImage && (
          <div
            className="edit-image-icon"
            onClick={() => setIsEditingImage(true)}
          >
            ✏️
          </div>
        )}
 {/* Edit Image Section */}
        {isEditingImage && (
          <div className="edit-image-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
            {image && <p>{image.name}</p>}
            <div className="edit-buttons">
              <button
                onClick={handleSaveImage}
                className="action-btn save"
                disabled={!image}
              >
                Save
              </button>
              <button onClick={handleCancelEdit} className="action-btn cancel">
                Cancel
              </button>
            </div>
          </div>
        )}
    </div>

    {/* Community Name and Description */}
    <div className="community-info">
      <h1 className="community-heading community-name">{community.name}</h1>
      <p>{community.description}</p>
    </div>

    {/* Sections for Approved and Pending Members */}
    <div className="members-sections">
      {/* Pending Members Section */}
      <div className="members-section pending-section">
        <h2 className="community-heading">Pending Members</h2>
        {community.members.some((member) => member.status === "pending") ? (
          <div className="members-list pending">
            {community.members
              .filter((member) => member.status === "pending")
              .map((member) => (
                <div key={member._id} className="member-card">
                  <img
                    src={`${SERVER_PATHNAME}/${member.userId.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={member.userId.name}
                    className="member-image"
                  />
                  <div className="member-info">
                    <h3>{member.userId.name}</h3>
                    <p>{member.userId.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleMemberAction(member.userId._id, "approve")
                    }
                    className="action-btn approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleMemberAction(member.userId._id, "reject")
                    }
                    className="action-btn reject"
                  >
                    Reject
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p>No pending members.</p>
        )}
      </div>

      {/* Approved Members Section */}
      <div className="members-section approved-section">
        <h2 className="community-heading">Approved Members</h2>
        {community.members.some((member) => member.status === "approved") ? (
          <div className="members-list approved">
            {community.members
              .filter((member) => member.status === "approved")
              .map((member) => (
                <div key={member._id} className="member-card">
                  <img
                    src={`${SERVER_PATHNAME}/${member.userId.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={member.userId.name}
                    className="member-image"
                  />
                  <div className="member-info">
                    <h3>{member.userId.name}</h3>
                    <p>{member.userId.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleMemberAction(member.userId._id, "remove")
                    }
                    className="action-btn remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p>No approved members.</p>
        )}
      </div>
    </div>
  </div>
);


};

export default CommunityDetails;

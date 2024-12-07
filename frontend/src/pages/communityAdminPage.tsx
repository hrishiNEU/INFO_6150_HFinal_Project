import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import "../styles/communityAdminPage.css";
import { SERVER_PATHNAME } from "@utils/urls";

const CommunityAdminPage = () => {
   const [apiData, setApiData] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (token) {
      const fetchCommunities = async () => {
        try {
          const response = await axios.get(
            `${SERVER_PATHNAME}/api/users/created-communities`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCommunities(response.data); // Set communities data
        } catch (error) {
          console.error("Error fetching communities:", error);
        }
      };
      fetchCommunities();
    }
  }, [token]);
    useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${SERVER_PATHNAME}/api/community/api/admin-overview`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setApiData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [token]);

  return (
    <div className="community-container">
      <div className="analytics-cards">
        <div className="analytics-card">
          <p>{apiData?.overview?.totalCommunities || 0}</p>
          <h3>Total Communities</h3>
        </div>

        <div className="analytics-card">
          <p>{apiData?.overview?.totalMembers || 0}</p>
          <h3>Total Members</h3>
        </div>

        <div className="analytics-card">
          <p>{apiData?.overview?.pendingRequests || 0}</p>
          <h3>Pending Invites</h3>
        </div>
      </div>
      <h1 className="community-heading">My Communities</h1>

      <div className="communities-list">
        {communities.length > 0 ? (
          communities.map((community) => (
            <div key={community.id} className="community-card">
              <Link to={`/communityAdminPage/community/${community.id}`} className="community-link">
                {community.image ? (
                  <img
                    src={`${SERVER_PATHNAME}/${community.image.replace(/\\/g, '/')}`}
                    alt={community.name}
                    className="community-list-image"
                  />
                ) : (
                  <div className="default-image">No Image</div>
                )}
                <h3>{community.name}</h3>
                <p>{community.description}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No communities created yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityAdminPage;

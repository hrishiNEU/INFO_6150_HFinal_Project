import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/communityUser.css";
import { SERVER_PATHNAME } from "@utils/urls";

const STATIC_IMAGE =
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Fetch all communities
const fetchCommunities = async (token: string) => {
  const response = await axios.get(`${SERVER_PATHNAME}/api/community`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("response", response.data);
  return response.data;
};

// Join a community
const joinCommunity = async ({ id, token }: { id: string; token: string }) => {
  const response = await axios.post(
    `${SERVER_PATHNAME}/api/community/${id}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

const CommunityUser = () => {
  const { token, id } = useSelector((state: any) => state.auth);

  const queryClient = useQueryClient();

  // State for notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch communities
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["communities"],
    queryFn: () => fetchCommunities(token),
  });

  // Mutation to join a community
  const mutation = useMutation({
    mutationFn: ({ id }: { id: string }) => joinCommunity({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setSuccessMessage(`Successfully Sent a request to the Community Admin`);
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      console.error("Error joining community:", error);
    },
  });

  if (isPending) {
    return <div className="flex">Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching communities:", error);
    return <div className="flex">Something went wrong...</div>;
  }

  console.log(id);
  const notJoinedCommunities = data.filter(
    (community: any) =>
      !community.members.some((member: any) => member.userId === id),
  );

  const pendingCommunities = data.filter((community: any) =>
    community.members.some(
      (member: any) => member.userId === id && member.status === "pending",
    ),
  );

  console.log("pending communties", pendingCommunities);

  const approvedCommunities = data.filter((community: any) =>
    community.members.some(
      (member: any) => member.userId === id && member.status === "approved",
    ),
  );

  return (
    <div className="main-container">
      {/* Notification */}
      {successMessage && <div className="alert success">{successMessage}</div>}

      {/* Joined Communities */}
      <div className="section-container">
        <div className="section-title">My Communities</div>
        <div className="cards-container">
          {!approvedCommunities.length && <div>No communities</div>}
          {!!approvedCommunities.length &&
            approvedCommunities?.map((communityItem: any, index: number) => {
              return (
                <div className="card" key={index}>
                  <div className="card-title">{communityItem.name}</div>
                  <div className="card-description">
                    {communityItem.description}
                  </div>
                  <div className="card-image-container">
                    <img
                      src={
                        communityItem?.image
                          ? `${SERVER_PATHNAME}/${communityItem.image}`
                          : STATIC_IMAGE
                      }
                      alt={communityItem?.name}
                      className="card-image"
                    />
                  </div>
                  <div className="card-members">
                    {communityItem?.members.length} members
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Pending Communities */}
      <div className="section-container">
        <div className="section-title">Pending for Approval</div>
        <div className="cards-container">
          {!pendingCommunities.length && <div>No communities</div>}
          {!!pendingCommunities.length &&
            pendingCommunities?.map((communityItem: any, index: number) => {
              return (
                <div className="card" key={index}>
                  <div className="card-title">{communityItem.name}</div>
                  <div className="card-description">
                    {communityItem.description}
                  </div>
                  <div className="card-image-container">
                    <img
                      src={
                        communityItem?.image
                          ? `${SERVER_PATHNAME}/${communityItem.image}`
                          : STATIC_IMAGE
                      }
                      alt={communityItem?.name}
                      className="card-image"
                    />
                  </div>
                  <div className="card-members">
                    {communityItem?.members.length} members
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Unjoined Communities */}
      <div className="section-container">
        <div className="section-title">Explore New Communities</div>
        <div className="cards-container">
          {notJoinedCommunities?.map((communityItem: any, index: any) => {
            return (
              <div className="card" key={index}>
                <div className="card-title">{communityItem.name}</div>
                <div className="card-description">
                  {communityItem.description}
                </div>
                <div className="card-members join-card">
                  {communityItem?.members.length} members
                </div>
                <div className="card-image-container">
                  <img
                    src={
                      communityItem?.image
                        ? `${SERVER_PATHNAME}/${communityItem.image}`
                        : STATIC_IMAGE
                    }
                    alt={communityItem?.name}
                    className="card-image"
                  />
                </div>
                <button
                  className="join-button"
                  onClick={() => mutation.mutate({ id: communityItem.id })}
                  disabled={mutation.status === "pending"}
                >
                  {mutation.status === "pending" ? "Joining..." : "Join"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityUser;

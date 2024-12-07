import Community from "../models/Community.js";
import User from "../models/User.js";
import path from "path";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";


// Create a new community
export const createCommunity = async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.path.replace("\\", "/") : "";

  try {
    const newCommunity = await Community.create({
      name,
      description,
      createdBy: req.user._id,
      image,
    });

    res.status(201).json({
      message: "Community created successfully",
      community: newCommunity,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View all communities
export const viewCommunities = async (req, res) => {
  try {
    // Get all communities and populate the 'createdBy' field
    const communities = await Community.find()
      .populate("createdBy", "name email") // Populate createdBy with only name and email
      .select("name description members createdBy"); // Select necessary fields

    // Format the response to include community name, description, member status, and createdBy info
    const formattedCommunities = communities.map((community) => {
      return {
        id: community._id,
        name: community.name,
        description: community.description,
        image: community.image,
        members: community.members.map((member) => ({
          userId: member.userId,
          status: member.status,
        })),
        createdBy: {
          id: community.createdBy._id,
          name: community.createdBy.name,
          email: community.createdBy.email,
        },
      };
    });

    res.status(200).json(formattedCommunities);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Join a community
export const joinCommunity = async (req, res) => {
  const { id } = req.params;

  try {
    const community = await Community.findById(id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    // Check if user is already a member
    const isMember = community.members.some(
      (member) => member.userId.toString() === req.user._id.toString()
    );
    if (isMember)
      return res
        .status(400)
        .json({ message: "Already a member or request pending" });

    // Add user to members list
    community.members.push({ userId: req.user._id });
    await community.save();

    // Add community to user's enrolled communities
    const user = await User.findById(req.user._id);
    if (!user.communities.includes(community._id)) {
      user.communities.push(community._id);
      await user.save();
    }

    res.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Manage members
export const manageMembers = async (req, res) => {
  const { id } = req.params;
  const { action, userId } = req.body;

  try {
    // Retrieve community with creator and member details
    const community = await Community.findById(id)
      .populate("createdBy", "name email")
      .populate("members.userId", "name email profileImage");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the current user is the admin
    if (community.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const member = community.members.find(
      (m) => m.userId._id.toString() === userId.toString()
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (action) {
      case "approve":
        member.status = "approved";
        if (!user.communities.includes(community._id)) {
          user.communities.push(community._id);
        }
        break;

      case "reject":
      case "remove":
        // Remove member from community and community from user
        community.members = community.members.filter(
          (m) => m.userId._id.toString() !== userId.toString()
        );
        user.communities = user.communities.filter(
          (communityId) => communityId.toString() !== id
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    // Save changes to database
    await Promise.all([community.save(), user.save()]);

    res.status(200).json({
      message: `Member ${action}d successfully`,
      community,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunityById = async (req, res) => {
  const { id } = req.params; // Community ID passed as a URL parameter

  try {
    const community = await Community.findById(id)
      .populate("createdBy", "name email")
      .populate("members.userId", "name email profileImage");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminOverview = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming req.user contains the authenticated admin's info.

    // Fetch all communities managed by the admin
    const communities = await Community.find({ createdBy: adminId });

    // Calculate overview data
    const totalCommunities = communities.length;
    const totalMembers = communities.reduce(
      (sum, community) =>
        sum +
        community.members.filter((member) => member.status === "approved")
          .length,
      0
    );
    const pendingRequests = communities.reduce(
      (sum, community) =>
        sum +
        community.members.filter((member) => member.status === "pending")
          .length,
      0
    );

    // Prepare response data
    const response = {
      success: true,
      overview: {
        totalCommunities,
        totalMembers,
        pendingRequests,
      },
      communities: communities.map((community) => ({
        _id: community._id,
        name: community.name,
        members: community.members, // Array of member details
        pendingMembers: community.members.filter(
          (member) => member.status === "Pending"
        ).length,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCommunityProfile = async (req, res) => {
  const communityId = req.params.id; // Ensure you get the ID from params

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const image = path.normalize(req.file.path);

    // Update the community profile image in the database
    const updateCommunity = await Community.findByIdAndUpdate(
      communityId,
      { image },
      { new: true }
    );

    // Fix: Use correct variable for image replacement
    updateCommunity.image = updateCommunity.image.replace(/\\/g, "/");

    // Populate the updated community with createdBy and members details
    const populatedCommunity = await Community.findById(communityId)
      .populate("createdBy", "name email")
      .populate("members.userId", "name email profileImage");

    res.status(200).json({
      message: "Community updated successfully",
      community: populatedCommunity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Send a chat message in a community
export const sendChat = asyncHandler(async (req, res) => {
  const { id } = req.params; // Community ID
  const { message } = req.body; // Message content

  try {
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const chat = await Chat.create({
      message,
      sender: req.user._id,
      community: id,
    });

    const populatedChat = await Chat.findById(chat._id).populate(
      "sender",
      "name email profileImage"
    );

    res.status(201).json({
      message: "Chat message sent successfully",
      chat: populatedChat,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all chats for a community
export const getAllChats = asyncHandler(async (req, res) => {
  const { id } = req.params; // Community ID

  try {
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const chats = await Chat.find({ community: id })
      .populate("sender", "name email profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Chats fetched successfully",
      chats,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

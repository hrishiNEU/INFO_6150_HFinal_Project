import User from "../models/User.js";
import { generateToken } from "../utils/jwtUtils.js";
import bcrypt from "bcryptjs";
import Community from "../models/Community.js";
import path from "path";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const getUserMemberCommunities = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains authenticated user's info

    // Find communities where the user is a member
    const communities = await Community.find({
      "members.userId": userId,
    });

    // Format the response
    const formattedCommunities = communities.map((community) => {
      const userMembership = community.members.find(
        (member) => member.userId.toString() === userId.toString()
      );

      return {
        id: community._id,
        name: community.name,
        description: community.description,
        status: userMembership ? userMembership.status : null,
      };
    });

    res.status(200).json(formattedCommunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCreatedCommunities = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains authenticated user's info

    // Find communities where the user is the creator (createdBy field matches userId)
    const communities = await Community.find({
      createdBy: userId,
    }).populate("members.userId", "name email"); // Populate member's userId with name and email

    // Format the response
    const formattedCommunities = communities.map((community) => {
      return {
        id: community._id,
        name: community.name,
        description: community.description,
        image: community.image,
        createdBy: {
          id: community.createdBy._id,
          name: community.createdBy.name,
          email: community.createdBy.email,
        },
        members: community.members.map((member) => {
          return {
            userId: member.userId._id,
            name: member.userId.name,
            email: member.userId.email,
            status: member.status,
          };
        }),
      };
    });

    res.status(200).json(formattedCommunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle updating profile image
export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const profileImage = path.normalize(req.file.path);

    // Update user profile in the database with the new image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    updatedUser.profileImage = updatedUser.profileImage.replace(/\\/g, "/");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Delete User API
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsersAndCounts = async (req, res) => {
  try {
    const users = await User.find();
    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const roleCountMap = roleCounts.reduce((acc, role) => {
      acc[role._id] = role.count;
      return acc;
    }, {});

    res.status(200).json({
      users,
      roleCounts: roleCountMap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

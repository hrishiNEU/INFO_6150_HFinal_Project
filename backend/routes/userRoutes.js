import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserMemberCommunities,
  getUserCreatedCommunities,
  updateProfile,
  deleteUser,
  getAllUsersAndCounts,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "profileImages/";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.")
    );
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/member-communities", protect, getUserMemberCommunities);
router.get("/created-communities", protect, getUserCreatedCommunities);
router.post(
  "/uploadProfile",
  protect,
  upload.single("profileImage"),
  updateProfile
);
router.delete("/delete/:id", deleteUser);
router.get("/all-users", protect, getAllUsersAndCounts);

export default router;

import express from "express";
import saveContact  from "../controllers/contactController.js";


const router = express.Router();

router.post("/contact", saveContact);

export default router;

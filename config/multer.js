/*
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Saving to uploads folder...");
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        console.log("Incoming file:", file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
        console.log("File uploaded:", file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error ("Only JPEG and PNG images are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter, limits: {
    fileSize: 15 * 1024 * 1024 } });
*/

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure 'uploads' folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
    console.log("File uploaded:", file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

export default upload;
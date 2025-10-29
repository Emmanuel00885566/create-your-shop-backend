import multer from 'multer';
import fs from 'fs';

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Saving to uploads folder...");
        cb(null, uploadsDir); 
    },
    filename: (req, file, cb) => {
        console.log("Incoming file:", file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
        console.log("File uploaded:", file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    console.log("File mimetype:", file.mimetype);
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error ("Only JPEG and PNG images are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter, limits: {
    fileSize: 15 * 1024 * 1024 } });
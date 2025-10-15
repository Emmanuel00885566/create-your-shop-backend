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
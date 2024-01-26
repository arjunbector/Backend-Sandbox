import multer from "multer";
// TODO: Add random name to the file instead of the original name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uplaod = multer({ storage });

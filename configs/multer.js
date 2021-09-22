import multer from "multer";

let storage = multer.memoryStorage();

export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpeg and .jpg format allowed!"));
    }
  },
});

export default multer({ storage: storage });

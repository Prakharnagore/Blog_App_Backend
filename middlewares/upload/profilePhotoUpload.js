import multer from "multer";
import sharp from "sharp";
import path from "path";
// storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  // console.log("file", file);
  // check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // Rejected Files
    cb(
      {
        message: "Unsupported file type",
      },
      false
    );
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const profilePhotoResize = async (req, res, next) => {
  // check if there is no file
  // console.log(req.file);
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

export { profilePhotoUpload, profilePhotoResize };

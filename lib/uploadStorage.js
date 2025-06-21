import multer from "multer";
import { Jimp } from "jimp";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.PRODUCT_IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export async function createThumbnail(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    const imagePath = `${process.env.PRODUCT_IMAGE_DIR}/${req.file.filename}`;
    const extension = path.extname(req.file.filename);
    const imageName = path.basename(req.file.filename, extension);
    const thumbnailPath = `${process.env.PRODUCT_IMAGE_DIR}/${imageName}_thumbnail${extension}`;

    const image = await Jimp.read(imagePath);
    image.cover({ w: 100, h: 100 });
    await image.write(thumbnailPath);

    next();
  } catch (error) {
    next(error);
  }
}

import multer from "multer";
import path from "path";
import fs from "fs";
import util from "util";
import { fileURLToPath } from "url";

const maxSize = 2 * 1024 * 1024;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, "../..");
const uploadDir = "/uploads";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = baseDir + uploadDir;

    if (!fs.existsSync(path)) {
      // Make directory if it doesn't exist
      fs.mkdirSync(path, { recursive: true });
    }

    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");

let removeFile = (fileName) => {
  fs.unlinkSync(baseDir + uploadDir + fileName);
};

let readFile = (fileName) => {
  return fs.readFileSync(baseDir + uploadDir + "/" + fileName);
};

const exportFunctions = {
  upload: util.promisify(uploadFile),
  remove: removeFile,
  read: readFile,
};

export default exportFunctions;

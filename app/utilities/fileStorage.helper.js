import multer from "multer";
import path from "path";
import fs from "fs";
import util from "util";
import { v4 as uuidv4 } from "uuid";
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
    const fileExt = path.extname(file.originalname);

    const uniqueFilename = `${uuidv4()}-${Date.now()}${fileExt}`;

    req.savedFileName = uniqueFilename;

    cb(null, uniqueFilename);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");

let removeFile = (fileName) => {
  const path = baseDir + uploadDir + "/" + fileName;
  fs.unlinkSync(path);
};

let readFile = (fileName) => {
  const path = baseDir + uploadDir + "/" + fileName;
  return fs.readFileSync(path);
};

const exportFunctions = {
  upload: util.promisify(uploadFile),
  remove: removeFile,
  read: readFile,
};

export default exportFunctions;

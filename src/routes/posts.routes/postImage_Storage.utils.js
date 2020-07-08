import multer from 'multer';
import fs, { mkdir } from 'fs';

// multer set up
// to set up diskStorage using multer (create a directory)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let storagePath = './media/post_image';
        // we are creating folders if they don't exist
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }
        // console.log('line 245');
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        // console.log('file line 26', file);
        cb(null, 'post_image_' + req['userId'] + Date.now() + file.originalname);
    },
});

// to upload images to the above created durectory
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image'];
const uploadPostImage = multer({
    limits: {
        fieldSize: 1024 * 1024 * 5, //5MB
    },
    fileFilter(req, file, cb) {
        // console.log('file', file);
        // console.log(allowedMimeTypes.includes(file.mimetype));
        if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'));
    },
    storage,
});

export default uploadPostImage;

// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import uploadDp from './dp_storage.util';
import { NO_UNKNOWN } from 'utils/constants';
import { sendData, sendServerError, sendError, sendMessage } from 'utils/response';

//models
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

const uploadDpUserReqBody = yup.object().shape({}).strict(true).noUnknown(true, NO_UNKNOWN);

export default [
    uploadDp.single('dpFile'),
    // for multer to parse formData and place req.body, so that it can be validated
    // for unwanted data except file, which is validated in multer upload function defination
    validate(uploadDpUserReqBody),
    async (req, res, next) => {
        const userId = req.userId;
        const dpfile = req.file;
        // file missing in form data -> mulre upload did not run -> no file key on req
        if (!dpfile) return sendError(res, message('dp not updated', 'dp file is missing'), message('dp not updated', 'dp file is missing'));
        try {
            const user = await User.findOne({
                where: { id: userId, statusId: 1 },
                include: {
                    model: UserDp,
                    attributes: ['id', 'url'],
                    as: 'dp',
                },
            });
            if (!user) return sendMessage(res, message('user not found', 'invalid user id or user is deactivated'));

            // checking if dp is existing else create dp
            const dpFilePath = `user_dp/${dpfile.filename}`;
            if (user.dp) {
                console.log('user.dp', user.dp.get());
                user.dp.url = dpFilePath;
                console.log('user.dp.url', user.dp.url);
                await user.dp.save();
            } else {
                await user.createDp({ url: dpFilePath });
                console.log('in else');
            }
            sendMessage(res, message('Dp updated', 'Dp updated'));
        } catch (error) {
            next(error);
        }
    },
];

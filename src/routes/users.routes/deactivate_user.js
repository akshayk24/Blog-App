import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { sendError, sendData, sendMessage } from 'utils/response';
import { NO_UNKNOWN } from 'utils/constants';
import message from 'utils/message';

// models
import User from 'models/user/user.model';

const deactivateUserReqBody = yup
    .object()
    .shape({ userId: yup.number().required('User id is required') })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(deactivateUserReqBody),
    async (req, res, next) => {
        // const userId = req.validatedBody.userId;     // if req object is not destructed (console for more clarity)
        const { userId } = req.validatedBody; // if req object is destructed (console for more clarity)
        try {
            const user = await User.findOne({
                where: { status: 1, id: userId },
            });
            if (!user) return sendError(res, message('User not found', 'Some internal error'), message('Something went wrong', 'Could not update user'));

            // assigining the status id to 2
            if (user.statusId != 2) user.statusId = 2;
            if (user.changed()) await user.save();
            sendMessage(res, 'User Deactivated');
        } catch (error) {
            next(error);
        }
    },
];

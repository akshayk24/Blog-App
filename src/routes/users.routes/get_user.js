import * as yup from 'yup';

// validators
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';

// models
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

const getUserReqBody = yup
    .object()
    .shape({
        userId: yup.number().required('User Id is required'),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(getUserReqBody),
    async (req, res, next) => {
        const { userId } = req.validatedBody;
        console.log('comsole', userId);
        try {
            const user = await User.findOne({ where: { id: userId, statusId: 1 }, include: { model: UserDp, attributes: ['url'], as: 'dp' } });

            if (!user) return sendError(res, 'User not found', 'User not found');
            sendData(res, { user: user.get() });
        } catch (error) {
            next(error);
        }
    },
];

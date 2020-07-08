// imports
import * as yup from 'yup';
import { pick } from 'lodash';
// import isAuth from 'middleware/is-auth';
import checkAuth from 'middleware/is-auth';
import message from 'utils/message';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendData, sendError } from 'utils/response';

//modles
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// validation Schema
const getAllUSersReqBody = yup.object().shape({}).strict(true).noUnknown(true, NO_UNKNOWN);

export default [
    validate(getAllUSersReqBody),
    // checkAuth,
    async (req, res, next) => {
        try {
            const users = await User.findAll({
                where: { statusId: 1 },
                attributes: ['id', 'emailId', 'firstName', 'lastName', 'bio'],
                include: {
                    model: UserDp,
                    attributes: ['url'],
                    as: 'dp',
                },
            });
            console.log('line 37 users', users);
            if (!users) return sendError(res, message('Internal error', 'User not found'), 'user error');

            // we are performing .map method because findAll returns an array of multiple objects, not one single object
            sendData(res, { users: users.map((user) => pick(user, ['id', 'emailId', 'firstName', 'lastName', 'dp'])) });
        } catch (error) {
            next(error);
        }
    },
];

// middlewares
import validate from 'middleware/validate-req-body';

import * as yup from 'yup';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendServerError } from 'utils/response';

// models
import UserStatus from 'models/user/userStatus.model';

// validation schema
const signUpReqBodySchema = yup
    .object()
    .shape({
        emailId: yup.string().trim().email().required('Email is required'),
        password: yup.string().trim().min(8, 'password should be atleast 8 characters').required('password is required'),
        firstName: yup.string().strict(true).trim().min(3).required('firstname is required'),
        lastName: yup.string().strict(true).trim().min(3).required('lastname is required'),
        bio: yup.string().trim().max(150).notRequired(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

// we are exporting it as an array because, router function can take an array as a param
export default [
    validate(signUpReqBodySchema),
    async (req, res, next) => {
        const { emailId, password, firstName, lastName, bio } = req['validatedBody'];
        try {
            // get status active record
            const status = await UserStatus.findOne({
                where: { name: 'active' },
            });

            // if status not in db
            if (!status) return sendError(res, message('Some Internal Issues', 'Status value does not exist'), 'Could not signup');

            // getter functions which returns the array of the users where emailId === req.emailId
            const users = await status.getUsers({
                where: { emailId },
            });

            if (users.length > 0) return sendError(res, message('Could not sign you up', 'Conflict'), message('Something went wrong', 'User already exists'));

            // to create a new user
            const newUser = await status.createUser(
                { emailId, password, firstName, lastName, bio },
                {
                    attributes: ['id', 'emailId', 'firstName', 'lastName', 'bio', 'statusId', 'dpId'],
                }
            );
            sendData(res, { newUser: newUser.toJSON() }); // can use newUser.get()
        } catch (error) {
            next(error);
        }
    },
];

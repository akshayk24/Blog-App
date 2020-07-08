import * as yup from 'yup';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { pick } from 'lodash';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData } from 'utils/response';

// models
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// validation schema
const loginReqBodySchema = yup
    .object()
    .shape({
        emailId: yup.string().trim().email().required('Email Id is required'),
        password: yup.string().trim().required('Password is required'),
    })
    .noUnknown(true, NO_UNKNOWN);

// api logic

export default [
    validate(loginReqBodySchema),
    async (req, res, next) => {
        const { emailId, password } = req.validatedBody;
        try {
            const user = await User.findOne({
                where: { emailId, statusId: 1 },
                include: {
                    model: UserDp,
                    attributes: ['url'],
                    as: 'dp',
                },
            });
            console.log('line 42', user.toJSON());

            // if user not found
            if (!user) return sendError(res, message('Unauthorized', 'User not found'), 'Auth failed');

            // verify password; 'match' returns true or false
            const match = await compare(password, user.password);
            console.log('line 48', match);

            // password not matched
            if (!match) return sendError(res, message('Unauthorized', 'Invalid password'), 'Auth failed');

            // to create a token and send it in response header once password is matched successfully (sign is JWT method)
            const token = sign(
                {
                    userId: user.id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            sendData(
                res,
                {
                    user: pick(user, ['id', 'emailId', 'firstName', 'lastName', 'bio', 'dp']),
                    token,
                    tokenValidity: 1,
                },
                'Logged In'
            );
        } catch (error) {
            next(error);
        }
    },
];

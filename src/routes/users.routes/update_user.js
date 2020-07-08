import * as yup from 'yup';
import { hash } from 'bcryptjs';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';

// models
import User from 'models/user/user.model';
import message from 'utils/message';

const updateUserReqBody = yup
    .object()
    .shape({
        userId: yup.number().required('User Id is required'),
        update_params: yup
            .object()
            .shape({
                firstName: yup.string().trim().notRequired(),
                lastName: yup.string().trim().notRequired(),
                bio: yup.string().trim().max(150).notRequired(),
                password: yup.string().trim().min(8).notRequired(),
            })
            .strict(true)
            .required('update params is required')
            .noUnknown(true, NO_UNKNOWN),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(updateUserReqBody),
    async (req, res, next) => {
        const { userId } = req.validatedBody;
        const { update_params } = req.validatedBody;
        const allowedUpdates = ['password', 'firstName', 'lastName', 'bio'];

        try {
            const user = await User.findOne({ where: { statusId: 1, id: userId }, attributes: ['password', 'firstName', 'lastName', 'bio', 'id'] });

            if (!user) return sendError(res, message('Some Internal issue', 'User not found'), message('Some Internal Issue', 'check user id input or check for user status'));

            // // update user fields in db traditional way
            // (user.firstName = update_params.firstName),
            //     (user.lastName = update_params.lastName),
            //     (user.password = await hash(update_params.password, 12)),
            //     (user.bio = update_params.bio),
            //     console.log('user', user.toJSON());
            // if (user.changed()) await user.save();

            // simplified approach to update user details in db
            Object.keys(update_params).forEach(async (key) => {
                // check for a key with value 'password' and perfrom hash encryption on it
                if (key === 'password') {
                    // to hash the password as it was not getting hashed in beforeUpdate hook in User models :/
                    update_params[key] = await hash(update_params[key], 12);
                }
                if (allowedUpdates.includes(key)) user[key] = update_params[key];
                if (user.changed()) await user.save();
            });
            sendMessage(res, 'User details updated');
        } catch (error) {
            next(error);
        }
    },
];

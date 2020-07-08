import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';
import message from 'utils/message';
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

const getAllPostReqBody = yup
    .object()
    .shape({
        categoryId: yup.number().positive().integer().notRequired(),
        userId: yup.number().positive().integer().notRequired(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(getAllPostReqBody),
    async (req, res, next) => {
        const { categoryId, userId } = req.validatedBody;

        // create a where object so as to dynamically declare the 'where' clause in query
        const where = {
            statusId: 1,
        };

        // dynamically created category id and appended it to where object (perform query where 'categoryId = categoryId')
        if (categoryId) where.categoryId = categoryId;
        // dynamically created user id and appended it to where object (perform query where 'addedBy = userId')
        else if (userId) where.addedBy = userId;
        // if in front end req no params are passed (empty req body) it implies that user id is the logged in user id, we are fectching it from token, ref is-auth line 18 to 31(decodeed token)
        else if (req.isAuth && req.userId) where.addedBy = req.userId;

        try {
            const posts = await Post.findAll({
                where,
                attributes: ['id', 'title', 'description', 'createdAt'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                        include: [{ model: UserDp, attributes: ['url'], as: 'dp' }],
                        as: 'author',
                    },
                ],
            });
            sendData(res, { posts: posts.map((post) => post.toJSON()) });
        } catch (error) {
            next(error);
        }
    },
];

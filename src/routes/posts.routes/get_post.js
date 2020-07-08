import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';
import message from 'utils/message';

// models
import Post from 'models/post/post.model';
import PostImage from 'models/post/postImage.model';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';
import Category from 'models/category.model';

const getPostReqBody = yup
    .object()
    .shape({ postId: yup.number().required('post id missing') })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(getPostReqBody),
    async (req, res, next) => {
        const { postId } = req.validatedBody;
        console.log('Post id', postId);
        try {
            const post = await Post.findOne({
                where: { id: postId, statusId: 1 },
                include: [
                    { model: Category, attributes: ['name'], as: 'category' },
                    { model: PostImage, attributes: ['url'], as: 'image' },
                    { model: User, attributes: ['id', 'firstName', 'lastName'], include: { model: UserDp, attributes: ['url'], as: 'dp' }, as: 'author' },
                ],
                attributes: {
                    exclude: ['imageId', 'addedBy', 'statusId', 'categoryId'],
                },
            });
            sendData(res, { post: post.toJSON() }, message('Successfully fetched a post', 'Post fetched successfully'));
        } catch (error) {
            next(error);
        }
    },
];

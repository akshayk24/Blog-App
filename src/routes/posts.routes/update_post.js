// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';

// models
import Post from 'models/post/post.model';

const updatePostReqBody = yup
    .object()
    .shape({
        postId: yup.number().positive('Post Id is incorrect').integer('Post Id is incorrect').required('Post Id is required'),
        title: yup.string().trim().notRequired(),
        description: yup.string().trim().notRequired(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(updatePostReqBody),
    async (req, res, next) => {
        const { postId, title, description } = req.validatedBody;
        const userId = req.userId;
        // if (!title && !description) return sendMessage(res, message('Post updated', 'empty or null params passed in input'));

        const allowedUpdates = ['title', 'description'];

        try {
            const post = await Post.findOne({
                where: { statusId: 1, id: postId },
            });
            if (!post)
                return sendError(res, message('Post not updated', 'Post does not exist or check status'), message('Post not updated', 'Post does not exist or check status'));

            // update changes of that instance other way of updating can be seen in update_user
            allowedUpdates.forEach((key) => {
                if (req.validatedBody[key]) post[key] = req.validatedBody[key];
            });

            //check if post values are changed(updated) and save
            if (post.changed()) await post.save();
            sendMessage(res, message('Post succcessfully updated', 'succcessfully updated'));
        } catch (error) {
            next(error);
        }
    },
];

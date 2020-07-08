// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendMessage, sendError, sendData } from 'utils/response';

//models
import Post from 'models/post/post.model';

const deactivatePostReqBody = yup
    .object()
    .shape({
        postId: yup.number().positive().integer().required(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    validate(deactivatePostReqBody),
    async (req, res, next) => {
        const { postId } = req.validatedBody;
        const userId = req.userId;
        console.log('postId', postId);
        try {
            // find post if it is added by logged in user, postId exists and if post is active
            const post = await Post.findOne({
                where: {
                    id: postId,
                    addedBy: userId,
                    statusId: 1,
                },
            });
            if (!post) return sendMessage(res, message('Post removed', 'Post not removed check status or user or post id'));

            // one way of updating a value, refet updated user for another way
            post.update({ statusId: 2 }); // because status id 2 is 'inactive'
            post.save();

            // send response msg
            sendMessage(res, message('Post deleted', 'Post deleted'));
        } catch (error) {
            next(error);
        }
    },
];

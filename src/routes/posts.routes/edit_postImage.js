// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import uploadPostImage from './postImage_Storage.utils';
import { NO_UNKNOWN } from 'utils/constants';
import { sendData, sendServerError, sendError, sendMessage } from 'utils/response';
import Post from 'models/post/post.model';
import PostImage from 'models/post/postImage.model';

const uploadPostImageReqBody = yup
    .object()
    .shape({
        postId: yup.string().required('post id is required'),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default [
    uploadPostImage.single('postImage'),
    validate(uploadPostImageReqBody),
    async (req, res, next) => {
        const { postId } = req.validatedBody;
        const userId = req.userId;
        const postImage = req.file;
        console.log('user id', userId);
        console.log('post id', postId);

        if (isNaN(parseInt(postId)))
            return sendError(res, message('Something went wrong, could not update post image', 'post Id invalid'), message('Could not update post', 'post Id invalid'));

        if (!postImage)
            return sendError(
                res,
                message('Something went wrong, could not update post image', 'postId invalid'),
                message('Something went wrong, could not update post image', 'postId invalid')
            );

        try {
            const post = await Post.findOne({
                where: { id: postId, statusId: 1, addedBy: userId },
                include: {
                    model: PostImage,
                    attributes: ['id', 'url'],
                    as: 'image',
                },
            });
            if (!post)
                return sendError(
                    res,
                    message('Post image not updated', 'Post does not exist or check status'),
                    message('Post image not updated', 'Post does not exist or check status')
                );

            // checking if post_image is exisiting else crate post_image in if condition is best to use the alias `image` like post.image
            const postImagePath = `post_image/${postImage.filename}`;
            if (post.image) {
                post.image.url = postImagePath;
                console.log(post.image.url);
                await post.image.save();
            } else {
                await post.createImage({ url: postImagePath });
            }
            sendMessage(res, message('post image updated', 'post image updated'));
        } catch (error) {
            next(error);
        }
    },
];

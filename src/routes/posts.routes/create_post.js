import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';

// models
import Post from 'models/post/post.model';
import PostImage from 'models/post/postImage.model';
import Category from 'models/category.model';
import User from 'models/user/user.model';
import message from 'utils/message';

const createPostReqBody = yup.object().shape({
    userId: yup.number().required('User id is reqired'),
    post_params: yup
        .object()
        .shape({
            categoryId: yup.number().required('categoryId is required'),
            title: yup.string().trim().min(3).required('title is required'),
            description: yup.string().trim().required('description is required'),
        })
        .strict(true)
        .required('Post Information reqired')
        .noUnknown(true, NO_UNKNOWN),
});

export default [
    validate(createPostReqBody),
    async (req, res, next) => {
        const { userId } = req.validatedBody;
        const { post_params } = req['validatedBody'];
        try {
            // check if the user adding the post exist and if the users' status is active
            const addedUser = await User.findOne({ where: { id: userId, statusId: 1 } });
            if (!addedUser) return sendError(req, message('Something went wrong', 'User id not exists'), message('Something went wrong', 'Error check user Id or status '));

            // check if the added post category exisit
            const category = await Category.findByPk(post_params.categoryId);
            if (!category) return sendError(req, message('Something went wrong', 'Categoery Id not exists'), message('Soenting went wrong', 'Error check for categoery id'));

            // create a post and save it in db
            const newPost = await Post.create({ title: post_params.title, description: post_params.description, addedBy: userId, categoryId: post_params.categoryId, statusId: 1 });
            sendData(res, { newPost: newPost.toJSON() }, message('Successfully created a post', 'Post created successfully'));
        } catch (error) {
            next(error);
        }
    },
];

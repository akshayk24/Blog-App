import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';

//models
import FavoritePost from 'models/favouritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';
import Post from 'models/post/post.model';
import message from 'utils/message';

const addToFavOrRlReqBody = yup
    .object()
    .shape({ postId: yup.number().integer('Post id is of wrong type').positive('Post id is invalid').required('post id missing') })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

/* here unlike other export default is not an array instead its a function,
as we are taking the value from the param(isFav: boolean) and perform addToFav(if isFav = true) api or addToReadLater(if isFav= false)api */
export default (isFav) => [
    validate(addToFavOrRlReqBody),
    async (req, res, next) => {
        const model = isFav ? FavoritePost : ReadLaterPost;
        /* we are delcaring a const model because value of model is dependent on isFav param
        if isFav = true => FavoritePost ; if isFav = false =>ReadLaterPost ref(model.findOrCreate)*/
        const { postId } = req.validatedBody;
        const userId = req.userId;
        console.log('user id', userId);
        try {
            // to check if post exsist and post status is acive (1)
            const post = await Post.findOne({
                where: { id: postId, statusId: 1 },
            });
            console.log('post', post.toJSON());
            if (!post) return sendMessage(res, message('post not added', 'post not added check input'));

            /*
            we are destructing an array here as [postAdded: model record instance, created: boolean] because findOrCreate returns an array like [modelInstance, boolean]
            |||ly instead of of destructing we can post the return of findOrCreate which is an array like [modelInstance , boolen] into a varibale and access the first index
            */
            const [postAdded, created] = await model.findOrCreate({
                where: {
                    postId: postId,
                    addedBy: userId,
                },
                defaults: {
                    postId: postId,
                    addedBy: userId,
                },
            });

            if (created) return sendMessage(res, message('Post added successfully', 'Post added successfully'));
        } catch (error) {
            next(error);
        }
    },
];

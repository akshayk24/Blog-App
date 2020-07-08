import * as yup from 'yup';

// validator
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendMessage } from 'utils/response';
import message from 'utils/message';

//models
import FavoritePost from 'models/favouritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';

const removeFromFavouritesReqBody = yup
    .object()
    .shape({
        postId: yup.number().positive().integer().notRequired(),
        favouritePostId: yup.number().positive().integer().notRequired(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

const removeFromReadLaterReqBody = yup
    .object()
    .shape({
        postId: yup.number().positive().integer().notRequired(),
        readLaterPostId: yup.number().positive().integer().notRequired(),
    })
    .strict(true)
    .noUnknown(true, NO_UNKNOWN);

export default (isFav = false) => [
    validate(isFav ? removeFromFavouritesReqBody : removeFromReadLaterReqBody),
    async (req, res, next) => {
        const model = isFav ? FavoritePost : ReadLaterPost;
        const messageKey = isFav ? 'favourites' : 'read later';
        const idKey = isFav ? 'favouritePostId' : 'readLaterPostId';
        const { postId } = req.validatedBody;
        const userId = req.userId;
        if (!postId && !req.validatedBody[idKey])
            return sendError(
                res,
                message(`Something went wrong, could not remove post from ${messageKey}`, `One of 'postId','${idKey}' is required`),
                message(`Could not remove post from ${messageKey}`, `One of 'postId','${idKey}' is required`)
            );
        const where = {};
        if (req.validatedBody[idKey]) where.id = req.validatedBody[idKey];
        else {
            where.postId = postId;
            where.addedBy = userId;
        }
        try {
            const instance = await model.findOne({
                where,
            });
            // if fav post not found
            if (!instance)
                return sendError(
                    res,
                    message(`Something went wrong, could not remove post from ${messageKey}`, `Post not found in ${messageKey}`),
                    message(`Could not remove post from ${messageKey}`, `Post not found in ${messageKey}`)
                );

            // delete fav post
            await instance.destroy();

            // send response
            sendMessage(res, `Remove form ${messageKey}`);
        } catch (error) {
            next(error);
        }
    },
];

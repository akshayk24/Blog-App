// express
// vendors
import * as yup from 'yup';
import { pick } from 'lodash';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import { sendData } from 'utils/response';
import { NO_UNKNOWN } from 'utils/constants';

// models
import FavoritePost from 'models/favouritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

const getAllFavAndReadLaterReqBody = yup.object().shape({}).strict(true).noUnknown(true, NO_UNKNOWN);

export default (isFav) => [
    validate(getAllFavAndReadLaterReqBody),
    async (req, res, next) => {
        const model = isFav ? FavoritePost : ReadLaterPost;
        const userId = req.userId;
        try {
            const instance = await model.findAll({
                where: {
                    addedBy: userId,
                },
                include: [
                    {
                        model: Post,
                        attributes: ['id', 'title', 'description', 'createdAt'],
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'firstName', 'lastName'],
                                include: [
                                    {
                                        model: UserDp,
                                        attributes: ['url'],
                                        as: 'dp',
                                    },
                                ],
                                as: 'author',
                            },
                        ],
                        as: 'post',
                    },
                ],
                // attributes: {
                //     exclude: ['createdAt', 'updatedAt', 'postId']
                // }
            });

            // send response
            sendData(res, {
                [isFav ? 'favoritePosts' : 'readLaterPosts']: instance.map((instance) => {
                    return {
                        ...instance.toJSON(),
                        post: pick(instance.post, ['id', 'title', 'createdAt', 'author']),
                    };
                }),
            });
        } catch (error) {
            next(error);
        }
    },
];

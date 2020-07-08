// express setup
import express from 'express';
import { checkAuth } from 'middleware/is-auth';

// apis
import create_post from './create_post';
import get_post from './get_post';
import get_all_posts from './get_all_posts';
import deactivate_post from './deactivate_post';
import add_to_favourities_or_readLater from './add_to_favourities_or_readLater';
import update_post from './update_post';
import get_all_favourite_or_readLater_posts from './get_all_favourite_or_readLater_posts';
import edit_postImage from './edit_postImage';

// router initializtion
const router = express.Router();

// routes  // router method can take an array as param so we are sending an array eg: create_post it is exported as array refer create_post.js API
router.post('/createPost', checkAuth, create_post);
router.post('/getPost', checkAuth, get_post);
router.post('/getAllPosts', checkAuth, get_all_posts);
router.post('/deletePost', checkAuth, deactivate_post);
router.post('/updatePost', checkAuth, update_post);
router.post('/editPostImage', checkAuth, edit_postImage);
router.post('/addPostToFavourities', checkAuth, add_to_favourities_or_readLater(true));
router.post('/addPostToReadLater', checkAuth, add_to_favourities_or_readLater(false));
router.post('/getAllFavouritePosts', checkAuth, get_all_favourite_or_readLater_posts(true));
router.post('/getAllReadLaterposts', checkAuth, get_all_favourite_or_readLater_posts(false));

export default router;

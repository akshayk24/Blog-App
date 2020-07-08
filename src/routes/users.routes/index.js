// express setup
import express from 'express';
import { checkAuth } from 'isAuth';

// apis
import signup from './signup';
import login from './login';
import get_all_users from './get_all_users';
import get_user from './get_user';
import deactivate_user from './deactivate_user';
import update_user from './update_user';
import edit_dp from './edit_dp';

// router initialization
const router = express.Router();

// routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/getAllUsers', checkAuth, get_all_users);
router.post('/getUser', checkAuth, get_user);
router.post('/updateUser', checkAuth, update_user);
router.post('/deactivateUser', checkAuth, deactivate_user);
router.post('/editDp', checkAuth, edit_dp);
export default router;

const express = require('express')
const userController = require('../controllers/user.controller')
const identifyUser = require('../middlewares/auth.middleware')

const userRouter = express.Router()

/**
 * @route   GET /api/users/follow/:username
 * @desc    Follow a user by username
 * @access  Private (Authenticated users only)
 * @param   {String} username - Username of user to follow
 * @returns {Object} Updated follow relationship
 * @throws  {404} If user not found
 * @throws  {400} If already following
 */
userRouter.get('/follow/:username', identifyUser, userController.followUserController)

/**
 * @route   GET /api/users/unfollow/:username
 * @desc    Unfollow a user by username
 * @access  Private (Authenticated users only)
 * @param   {String} username - Username of user to unfollow
 * @returns {Object} Success message
 * @throws  {404} If user not found or not following
 */

//for post we also add @body for things we ask in req.body
userRouter.get('/unfollow/:username', identifyUser, userController.unfollowUserController)

userRouter.get('/allFollowers', identifyUser, userController.getFollowersController)
userRouter.get('/getOtherUsers', identifyUser, userController.getOtherUsersController)
userRouter.get('/changeFollowerStatus/:username/:status', identifyUser, userController.changeFollowerStatusController)
userRouter.get('/followRequests', identifyUser, userController.getFollowRequestsController)
userRouter.get('/getMe', identifyUser, userController.getMeController)

module.exports = userRouter;
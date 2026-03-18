const express = require('express')
const postController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require('../middlewares/auth.middleware')

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), identifyUser, postController.createPostController)
postRouter.get('/', identifyUser, postController.getPostsController)

/**
 * @route get /api/posts/feed
 * @desc Get personalized feed of posts from followed users
 * @access Private (Authenticated users only)
 */
postRouter.get('/feed', identifyUser, postController.getFeedController)

/**
* @route get /api/posts/like/:id
* @desc Like a post by ID
* @access Private (Authenticated users only)
* @param {String} id - ID of the post to like
* @returns {Object} Updated like status
* @throws {404} If post not found
* @throws {400} If already liked
*/
postRouter.get('/like/:id', identifyUser, postController.likePostController)

/**
 * @route get /api/posts/dislike/:id
 * @desc Dislike a post by ID
 * @access Private (Authenticated users only)
 * @param {String} id - ID of the post to dislike
 * @returns {Object} Updated like status
 * @throws {404} If post not found
 * @throws {400} If not liked yet
 */
postRouter.get('/dislike/:id', identifyUser, postController.dislikePostController) 

/**
 * @route get /api/posts/myPosts
 * @desc Get posts created by the authenticated user
 * @access Private (Authenticated users only)
 * @returns {Array} List of user's posts
 * @throws {404} If user not found

 */
postRouter.get('/myPosts' , identifyUser , postController.getMyPostsController)

// ⚠️ Keep dynamic :id route LAST to avoid catching specific routes above
postRouter.get('/:id', identifyUser, postController.getPostDetailController)

module.exports = postRouter;
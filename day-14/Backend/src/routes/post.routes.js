const express = require('express')
const postController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require('../middlewares/auth.middleware')

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), identifyUser, postController.createPostController)
postRouter.get('/', identifyUser, postController.getPostsController)
postRouter.get('/:id', identifyUser, postController.getPostDetailController)
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

module.exports = postRouter;
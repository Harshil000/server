require('dotenv').config();
const postModel = require('../models/post.model')
const likeModel = require('../models/like.model')
const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPostController(req, res) {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ msg: "no file uploaded" })
    }


    const files = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: req.file.originalname,
        folder: '/instaCloneDemoPosts'
    })

    await postModel.create({
        caption: req.body.caption,
        imgUrl: files.url,
        user: userId
    })
    res.status(201).json({ msg: "post created successfully" })
}

async function getPostsController(req, res) {
    const userId = req.user.id;
    const post = await postModel.find({ user: userId })
    res.status(200).json({ "msg": "data fetched perfectly", post, userId })
}

async function getPostDetailController(req, res) {
    const requestForPostId = req.params.id;
    const userId = req.user.id;

    const post = await postModel.findOne({ _id: requestForPostId })

    if (!post) {
        return res.status(404).json({ "msg": "post not found" })
    }

    const isUserAuthorised = userId === post.user.toString()

    if (!isUserAuthorised) {
        return res.status(401).json({ "msg": "you are not owner of this post" })
    }

    res.status(200).json({ "msg": "got post", post })
}

async function likePostController(req, res) {
    const username = req.user.userName
    const postId = req.params.id

    let checkForPost = null

    try {
        checkForPost = await postModel.findOne({ _id: postId })
    } catch (err) {
        return res.status(404).json({ msg: "post not found" })
    }

    if (!checkForPost) {
        return res.status(404).json({ msg: "post not found 1" })
    }

    const alreadyLiked = await likeModel.findOne({ postId: postId, userName: username })

    if (alreadyLiked) {
        return res.status(400).json({ msg: "you have already liked this post" })
    }

    await likeModel.create({ postId: postId, userName: username })

    res.status(200).json({ msg: "post liked successfully", checkForPost })
}

async function dislikePostController(req, res) {
    const username = req.user.userName
    const postId = req.params.id

    let checkForPost = null

    try {
        checkForPost = await postModel.findOne({ _id: postId })
    } catch (err) {
        return res.status(404).json({ msg: "post not found" })
    }

    if (!checkForPost) {
        return res.status(404).json({ msg: "post not found" })
    }

    const alreadyLiked = await likeModel.findOne({ postId: postId, userName: username })

    if (alreadyLiked) {
        await likeModel.deleteOne({ postId: postId, userName: username })
        return res.status(200).json({ msg: "post disliked successfully" })
    }

    res.status(400).json({ msg: "you have not liked this post" })
}

module.exports = { createPostController, getPostsController, getPostDetailController, likePostController, dislikePostController }
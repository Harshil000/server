const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')

async function followUserController(req, res) {
    const username = req.user.userName
    const followinUserName = req.params.username

    const followingUser = await userModel.findOne({ userName: followinUserName })

    if (!followingUser) {
        return res.status(404).json({ msg: "user to follow not found" })
    }

    const followExist = await followModel.findOne({ follower: username, following: followingUser.userName })

    if (followExist) {
        return res.status(400).json({ msg: `you are already following ${followinUserName}` })
    }

    if (followingUser.userName === username) {
        return res.status(400).json({ msg: "you cannot follow yourself" })
    }

    await followModel.create({ follower: username, following: followingUser.userName })
    res.status(200).json({ msg: `you are now following ${followinUserName}` })
}

async function unfollowUserController(req, res) {
    const username = req.user.userName
    const followinUserName = req.params.username

    const isFollowing = await followModel.findOne({ follower: username, following: followinUserName })

    if (!isFollowing) {
        return res.status(400).json({ msg: `you are not following ${followinUserName}` })
    }

    await followModel.findOneAndDelete({ follower: username, following: followinUserName })
    res.status(200).json({ msg: `you have unfollowed ${followinUserName}` })
}

async function getFollowersController(req, res) {
    const ownusername = req.user.userName
    const allFollowers = await followModel.find({ following: ownusername })
    if (allFollowers.length === 0) {
        return res.status(404).json({ msg: "nobody follows you" })
    }
    res.status(200).json({ msg: "Here is list of all person following you", allFollowers })
}

async function changeFollowerStatusController(req, res) {
    const ownusername = req.user.userName
    const { status, username } = req.params

    const followRequest = await followModel.findOne({ follower: username, following: ownusername })

    if (!followRequest) {
        return res.status(404).json({ msg: "follow request not found" })
    }

    if (status === "reject"){
        if (followRequest.status === "rejected") {
            return res.status(400).json({ msg: "follow request already rejected" })
        }
        followRequest.status = "rejected"
        await followRequest.save()
        return res.status(200).json({ msg: `you have rejected ${username}'s follow request` })
    }

    if (status === "accept") {
        if (followRequest.status === "accepted") {
            return res.status(400).json({ msg: "follow request already accepted" })
        }
        followRequest.status = "accepted"
        await followRequest.save()
        return res.status(200).json({ msg: `you have accepted ${username}'s follow request` })
    }

    res.status(400).json({ msg: "invalid status" })
}

module.exports = { followUserController, unfollowUserController, getFollowersController, changeFollowerStatusController }
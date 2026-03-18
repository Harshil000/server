const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')

async function attachOutgoingFollowStatus(ownUsername, users) {
    if (!users.length) {
        return []
    }

    const usernames = users.map((user) => user.userName)
    const outgoingDocs = await followModel
        .find({ follower: ownUsername, following: { $in: usernames } })
        .select('following status')
        .lean()

    const statusByUsername = new Map(
        outgoingDocs.map((doc) => [doc.following, doc.status])
    )

    return users.map((user) => {
        const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
        return {
            ...plainUser,
            followStatus: statusByUsername.get(plainUser.userName) || 'none',
        }
    })
}

async function followUserController(req, res) {
    const ownUsername = req.user.userName
    const targetUsername = req.params.username

    if (targetUsername === ownUsername) {
        return res.status(400).json({ msg: 'you cannot follow yourself' })
    }

    const targetUser = await userModel.findOne({ userName: targetUsername }).select('_id')

    if (!targetUser) {
        return res.status(404).json({ msg: 'user to follow not found' })
    }

    const followDoc = await followModel.findOne({ follower: ownUsername, following: targetUsername })

    if (!followDoc) {
        await followModel.create({ follower: ownUsername, following: targetUsername, status: 'pending' })
        return res.status(200).json({ msg: `follow request sent to ${targetUsername}`, followStatus: 'pending' })
    }

    if (followDoc.status === 'accepted') {
        return res.status(400).json({ msg: `you are already following ${targetUsername}`, followStatus: 'accepted' })
    }

    if (followDoc.status === 'pending') {
        return res.status(400).json({ msg: `follow request already pending for ${targetUsername}`, followStatus: 'pending' })
    }

    followDoc.status = 'pending'
    await followDoc.save()

    return res.status(200).json({ msg: `follow request re-sent to ${targetUsername}`, followStatus: 'pending' })
}

async function unfollowUserController(req, res) {
    const ownUsername = req.user.userName
    const targetUsername = req.params.username

    if (targetUsername === ownUsername) {
        return res.status(400).json({ msg: 'you cannot unfollow yourself' })
    }

    const deleted = await followModel.findOneAndDelete({ follower: ownUsername, following: targetUsername })

    if (!deleted) {
        return res.status(400).json({ msg: `you do not have a follow relationship with ${targetUsername}` })
    }

    return res.status(200).json({ msg: `follow removed for ${targetUsername}`, followStatus: 'none' })
}

async function getFollowersController(req, res) {
    const ownUsername = req.user.userName

    const followDocs = await followModel
        .find({ following: ownUsername, status: 'accepted' })
        .select('follower')
        .lean()

    const followerUsernames = followDocs.map((doc) => doc.follower)
    const followers = await userModel
        .find({ userName: { $in: followerUsernames } })
        .select('name userName profile_image')
        .lean()

    const followersWithStatus = await attachOutgoingFollowStatus(ownUsername, followers)

    return res.status(200).json({ msg: 'followers fetched successfully', followers: followersWithStatus })
}

async function changeFollowerStatusController(req, res) {
    const ownUsername = req.user.userName
    const { status, username } = req.params

    if (!['accept', 'reject'].includes(status)) {
        return res.status(400).json({ msg: 'invalid status' })
    }

    const followRequest = await followModel.findOne({ follower: username, following: ownUsername })

    if (!followRequest) {
        return res.status(404).json({ msg: 'follow request not found' })
    }

    if (followRequest.status !== 'pending') {
        return res.status(400).json({ msg: `only pending requests can be ${status}ed` })
    }

    followRequest.status = status === 'accept' ? 'accepted' : 'rejected'
    await followRequest.save()

    return res.status(200).json({
        msg: `you have ${status === 'accept' ? 'accepted' : 'rejected'} ${username}'s follow request`,
        requestStatus: followRequest.status,
    })
}

async function getFollowRequestsController(req, res) {
    const ownUsername = req.user.userName

    const requests = await followModel
        .find({ following: ownUsername, status: 'pending' })
        .select('follower createdAt')
        .sort({ createdAt: -1 })
        .lean()

    const requestUsernames = requests.map((doc) => doc.follower)
    const requestUsers = await userModel
        .find({ userName: { $in: requestUsernames } })
        .select('name userName profile_image')
        .lean()

    const requestUsersByUsername = new Map(
        requestUsers.map((user) => [user.userName, user])
    )

    const followRequests = requests
        .map((doc) => {
            const user = requestUsersByUsername.get(doc.follower)
            if (!user) {
                return null
            }

            return {
                ...user,
                requestStatus: 'pending',
                requestedAt: doc.createdAt,
            }
        })
        .filter(Boolean)

    return res.status(200).json({ msg: 'follow requests fetched successfully', followRequests })
}

async function getOtherUsersController(req, res) {
    const ownUsername = req.user.userName

    const followerDocs = await followModel
        .find({ following: ownUsername, status: 'accepted' })
        .select('follower')
        .lean()

    const followerUsernames = followerDocs.map((doc) => doc.follower)

    const otherUsers = await userModel
        .find({
            userName: { $nin: [ownUsername, ...followerUsernames] },
        })
        .select('name userName profile_image')
        .lean()

    const otherUsersWithStatus = await attachOutgoingFollowStatus(ownUsername, otherUsers)

    return res.status(200).json({ msg: 'other users fetched successfully', otherUsers: otherUsersWithStatus })
}

async function getMeController(req , res){
    const ownUsername = req.user.userName
    const userId = req.user.id

    const userWithoutPassword = await userModel.findById(userId).select('-password').lean()

    if (!userWithoutPassword) {
        return res.status(404).json({ msg: 'user not found' })
    }

    const followerDocs = await followModel
        .find({ following: ownUsername, status: 'accepted' })
        .select('follower')
        .lean()

    const followerUsernames = followerDocs.map((doc) => doc.follower)
    const followers = await userModel
        .find({ userName: { $in: followerUsernames } })
        .select('name userName profile_image')
        .lean()

    const followersWithStatus = await attachOutgoingFollowStatus(ownUsername, followers)

    const otherUsers = await userModel
        .find({ userName: { $nin: [ownUsername, ...followerUsernames] } })
        .select('name userName profile_image')
        .lean()

    const otherUsersWithStatus = await attachOutgoingFollowStatus(ownUsername, otherUsers)

    const pendingIncomingDocs = await followModel
        .find({ following: ownUsername, status: 'pending' })
        .select('follower createdAt')
        .sort({ createdAt: -1 })
        .lean()

    const pendingIncomingUsernames = pendingIncomingDocs.map((doc) => doc.follower)
    const pendingIncomingUsers = await userModel
        .find({ userName: { $in: pendingIncomingUsernames } })
        .select('name userName profile_image')
        .lean()

    const pendingUsersByUsername = new Map(
        pendingIncomingUsers.map((item) => [item.userName, item])
    )

    const followRequests = pendingIncomingDocs
        .map((doc) => {
            const user = pendingUsersByUsername.get(doc.follower)
            if (!user) {
                return null
            }

            return {
                ...user,
                requestStatus: 'pending',
                requestedAt: doc.createdAt,
            }
        })
        .filter(Boolean)

    const followingCount = await followModel.countDocuments({
        follower: ownUsername,
        status: 'accepted',
    })

    return res.status(200).json({
        user: userWithoutPassword,
        followers: followersWithStatus,
        otherUsers: otherUsersWithStatus,
        followRequests,
        counts: {
            followers: followersWithStatus.length,
            following: followingCount,
        },
    })
}

module.exports = {
    followUserController,
    unfollowUserController,
    getFollowersController,
    getOtherUsersController,
    changeFollowerStatusController,
    getFollowRequestsController,
    getMeController,
}
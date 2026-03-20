import { useEffect, useMemo, useState } from "react"
import { useUser } from "../hooks/useUser";

const Sidebar = () => {
    const { getMe, handleFollowUser, handleUnfollowUser } = useUser();
    const [profile, setProfile] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [counts, setCounts] = useState({ followers: 0, following: 0 });
    const [buttonLoading, setButtonLoading] = useState({});

    const safeFollowersCount = useMemo(() => counts.followers ?? followers.length, [counts, followers.length]);
    const safeFollowingCount = useMemo(() => counts.following ?? 0, [counts]);

    const fetchSidebarData = async () => {
        const res = await getMe();
        setProfile(res?.me || null);
        setMyPosts(res?.posts || []);
        setFollowers(res?.followers || []);
        setOtherUsers(res?.otherUsers || []);
        setCounts(res?.counts || { followers: 0, following: 0 });
    };

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            try {
                if (isMounted) {
                    await fetchSidebarData();
                }
            } finally {
                if (isMounted) {
                    setProfileLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const getFollowButtonLabel = (status, isLoading) => {
        if (isLoading) {
            return "Please wait...";
        }

        if (status === "accepted") {
            return "Following";
        }

        if (status === "pending") {
            return "Pending";
        }

        return "Follow";
    };

    const onFollowButtonClick = async (user) => {
        const username = user.userName;
        setButtonLoading((prev) => ({ ...prev, [username]: true }));

        try {
            if (user.followStatus === "accepted") {
                await handleUnfollowUser(username);
            } else if (user.followStatus !== "pending") {
                await handleFollowUser(username);
            }

            await fetchSidebarData();
        } catch (error) {
            console.error(error);
        } finally {
            setButtonLoading((prev) => ({ ...prev, [username]: false }));
        }
    };

    if (profileLoading) {
        return <div className="sidebar"><p>Loading profile...</p></div>;
    }

  return (
    <div className='sidebar'>
        <div className="profile">
            {profile ? (
                <>
                    <h3>Profile</h3>
                    <div className="userInfo">
                        <img src={profile.profile_image || ""} alt={profile.name || "user"} />
                        <div className="infoText">
                            <p>{profile.name}</p>
                            <p>@{profile.userName}</p>
                        </div>
                    </div>
                    <div className="idInfo">
                        <div className="infoHolder">
                            <h4>Posts</h4>
                            <p>{myPosts.length}</p>
                        </div>
                        <div className="infoHolder">
                            <h4>Followers</h4>
                            <p>{safeFollowersCount}</p>
                        </div>
                        <div className="infoHolder">
                            <h4>Following</h4>
                            <p>{safeFollowingCount}</p>
                        </div>
                    </div>
                </>
            ) : (
                <p>Profile not available</p>
            )}
        </div>
        <div className="followers">
            <h3>Followers</h3>
            {!followers.length && <p>No followers yet</p>}
            {followers.slice(0, 4).map((user) => (
                <div className="userInfo" key={user._id}>
                    <img src={user.profile_image} alt={user.name} />
                    <div className="infoText">
                        <p>{user.name}</p>
                        <p>@{user.userName}</p>
                    </div>
                    <button
                        type="button"
                        className={`followBtn ${user.followStatus === "accepted" ? "following" : ""}`}
                        onClick={() => onFollowButtonClick(user)}
                        disabled={buttonLoading[user.userName] || user.followStatus === "pending"}
                    >
                        {getFollowButtonLabel(user.followStatus, Boolean(buttonLoading[user.userName]))}
                    </button>
                </div>
            ))}
            {followers.length > 4 && <p>{followers.length - 4} more followers...</p>}
        </div>
        <div className="otherUsers">
            <h3>Other Person</h3>
            {!otherUsers.length && <p>No users found</p>}
            {otherUsers.slice(0, 4).map((user) => (
                <div className="userInfo" key={user._id}>
                    <img src={user.profile_image} alt={user.name} />
                    <div className="infoText">
                        <p>{user.name}</p>
                        <p>@{user.userName}</p>
                    </div>
                    <button
                        type="button"
                        className={`followBtn ${user.followStatus === "accepted" ? "following" : ""}`}
                        onClick={() => onFollowButtonClick(user)}
                        disabled={buttonLoading[user.userName] || user.followStatus === "pending"}
                    >
                        {getFollowButtonLabel(user.followStatus, Boolean(buttonLoading[user.userName]))}
                    </button>
                </div>
            ))}
                        {otherUsers.length > 4 && <p>{otherUsers.length - 4} more users...</p>}
        </div>
    </div>
  )
}

export default Sidebar
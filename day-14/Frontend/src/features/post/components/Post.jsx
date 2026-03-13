const Post = (props) => {

    const { imgInfo, user } = props.values;

    return (<div className="post">
        <div className="user">
            <img src={user.profile_image} alt="User" />
            <p>{user.userName}</p>
        </div>
        <img src={imgInfo.imgUrl} alt="Post" />
        <div className="actions">
            <div className="left">
                <button className="action-btn like">
                    <i className="ri-heart-line"></i>
                </button>
                <button className="action-btn comment">
                    <i className="ri-chat-3-line"></i>
                </button>
                <button className="action-btn share">
                    <i className="ri-share-line"></i>
                </button>
            </div>
            <div className="right">
                <button className="action-btn save">
                    <i className="ri-bookmark-line"></i>
                </button>
            </div>
        </div>
        <div className="bottom">
            <p className="caption">{imgInfo.caption}</p>
        </div>
    </div>
    )
}

export default Post
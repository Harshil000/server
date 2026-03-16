import { useState, useRef } from "react";
import { usePost } from "../hooks/usePost";

const Post = (props) => {


    const { imgInfo, user } = props.values;
    const [isLiked, setIsLiked] = useState(imgInfo.isLiked);
    const debounceTimer = useRef(null);
    const { handleLikePost } = usePost();

    // Debounced like handler
    const handleLike = () => {
        setIsLiked((prev) => {
            const newLiked = !prev;
            // Clear previous debounce
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            // Set new debounce
            debounceTimer.current = setTimeout(() => {
                handleLikePost(imgInfo.id , isLiked);
            }, 500); // 500ms debounce
            return newLiked;
        });
    };

    return (
        <div className="post">
            <div className="user">
                <img src={user.profile_image} alt="User" />
                <p>{user.userName}</p>
            </div>
            <img src={imgInfo.imgUrl} alt="Post" />
            <div className="actions">
                <div className="left">
                    <button onClick={handleLike} className={`action-btn like ${isLiked ? 'liked' : ''}`}>
                        <i className={isLiked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
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
    );
}

export default Post
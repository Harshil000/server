import '../styles/feed.scss'
import { usePost } from '../hooks/usePost'
import { useEffect } from 'react'
import Post from '../components/Post'
import Navbar from '../components/Navbar'

const Feed = () => {

    const {loading, post, feed, handleGetFeed} = usePost()

    useEffect(() => {
        handleGetFeed()
    },[])

    if (loading || !feed) {
        return <div className="feed-page"><p>Loading feed...</p></div>
    }

    return (
        <main className='feed-page'>
            <Navbar />
            <div className="feed">
                <div className="posts">

                    {feed.map((post) => {
                        return <Post key={post._id} values={{imgInfo : {caption : post.caption , imgUrl : post.imgUrl , isLiked : post.isLiked} , user : post.user}}/>
                    })}

                    <div className="post">
                        <div className="user">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="User" />
                            <p>sarah_smith</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop" alt="Post" />
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
                            <p className="caption">Mountain adventures are the best! 🏔️</p>
                        </div>
                    </div>

                    <div className="post">
                        <div className="user">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop" alt="User" />
                            <p>mike_wilson</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop" alt="Post" />
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
                            <p className="caption">Coffee time ☕ Perfect start to the day</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Feed
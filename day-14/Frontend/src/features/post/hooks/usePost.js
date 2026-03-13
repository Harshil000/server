import { getFeed } from '../services/post.api';
import { postContext } from '../post.context';
import { useContext } from 'react';

export const usePost = () => {
    const context = useContext(postContext);
    const {loading , setLoading , post , setPost , feed , setFeed} = context;
    
    const handleGetFeed = async () => {
        setLoading(true);
        try {
            const data = await getFeed();
            setFeed(data.posts);
        } catch (error) {
            console.error('Error fetching feed:', error);
        } finally {
            setLoading(false);
        }
    }
    return {loading, post, feed, handleGetFeed};
}
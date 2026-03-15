import { getFeed ,createPost } from '../services/post.api';
import { postContext } from '../post.context';
import { useContext , useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePost = () => {
    const navigate = useNavigate();
    const context = useContext(postContext);
    const [error , setError] = useState('');
    const {loading , setLoading , post , setPost , feed , setFeed} = context;
    
    const handleGetFeed = async () => {
        setLoading(true);
        try {
            const data = await getFeed();
            console.log(data.posts)
            setFeed(data.posts);
        } catch (error) {
            console.error('Error fetching feed:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreatePost = async (caption , imageFile) => {
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('caption', caption);
            data.append('image', imageFile);
            const response = await createPost(data);
            navigate('/');
        } catch (err) {
            const errorMessage = err.message || 'Post creation failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }
    return {loading, post, feed, error,setError , handleGetFeed, handleCreatePost};
}
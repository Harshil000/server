import { useRef } from 'react';
import { usePost } from '../hooks/usePost';

const CreatePost = () => {

    const fileInputRef = useRef(null);
    const captoinInputRef = useRef(null);

    const { loading, error , handleCreatePost , setError } = usePost();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageFile = fileInputRef.current?.files[0] || null;

        if (!imageFile) {
            setError('Please select an image to upload.');
            return;
        }

        try {
            await handleCreatePost(captoinInputRef.current.value, imageFile);
            e.target.reset();
        } catch (err) {
            console.error('Post creation failed:', err);
        }
    };

    return (
        <main className="login-register-page">
            {error && <div className="error-message">{error}</div>}
            <div className="form-container">
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="caption"
                        placeholder="Caption"
                        ref={captoinInputRef}
                        disabled={loading}
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        ref={fileInputRef}
                        disabled={loading}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreatePost;
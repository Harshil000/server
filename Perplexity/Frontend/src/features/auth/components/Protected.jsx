import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

const Protected = ({ children }) => {

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (loading) {
        return <div>Loading...</div>
    }
    
  return !loading && user ? children : <Navigate to="/login" />;
}

export default Protected
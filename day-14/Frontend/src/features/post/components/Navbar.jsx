import '../styles/navbar.scss'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <i className="ri-instagram-line"></i>
          <span>instaClone</span>
        </div>
        <div className="navbar-content">
          <button className="create-post-btn" onClick={() => navigate('/create-post')}>
            <i className="ri-add-circle-line"></i>
            <span>Create</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
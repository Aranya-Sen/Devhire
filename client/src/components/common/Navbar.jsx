import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        DevHire
      </Link>

      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link to="/candidate/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Candidate Login
            </Link>
            <Link
              to="/company/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 Hover"
            >
              Company Login
            </Link>
          </>
        )}

        {user?.role === 'candidate' && (
          <>
            <Link to="/candidate/jobs" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Browse Jobs
            </Link>
            <Link to="/candidate/applications" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              My Applications
            </Link>
            <Link to="/candidate/profile" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-medium">
              Logout
            </button>
          </>
        )}

        {user?.role === 'company' && (
          <>
            <Link to="/company/jobs" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              My Jobs
            </Link>
            <Link to="/company/post-job" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Post Job
            </Link>
            <Link to="/company/profile" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-medium">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CandidateHome = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-10">Here's what you can do today</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/candidate/jobs"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">Browse Jobs</h3>
          <p className="text-gray-500 text-sm">Search and filter the latest openings</p>
        </Link>

        <Link to="/candidate/applications"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">My Applications</h3>
          <p className="text-gray-500 text-sm">Track your application pipeline</p>
        </Link>

        <Link to="/candidate/profile"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="text-3xl mb-3">👤</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">My Profile</h3>
          <p className="text-gray-500 text-sm">Update your details and resume</p>
        </Link>
      </div>
    </div>
  );
};

export default CandidateHome;
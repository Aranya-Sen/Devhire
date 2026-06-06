import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in redirect to their home
  useEffect(() => {
    if (user?.role === 'candidate') navigate('/candidate/home');
    if (user?.role === 'company') navigate('/company/home');
    if (user?.role === 'admin') navigate('/devhire-admin/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-24 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Find Your Next <span className="text-blue-600">Dev Role</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          DevHire connects developers with top companies. Apply to jobs, track your applications, and land your dream role — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">For Candidates</span>
            <div className="flex gap-3">
              <Link
                to="/candidate/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/candidate/login"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Log In
              </Link>
            </div>
          </div>

          <div className="hidden sm:block w-px bg-gray-200 mx-2" />

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">For Companies</span>
            <div className="flex gap-3">
              <Link
                to="/company/register"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/company/login"
                className="border border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Search & Filter Jobs</h3>
            <p className="text-gray-500 text-sm">Filter by location, tech stack, job type and more.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Resume Upload</h3>
            <p className="text-gray-500 text-sm">Upload your resume once and apply to multiple jobs instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Track Applications</h3>
            <p className="text-gray-500 text-sm">Know exactly where you stand — Applied, Screening, Interview, Offer.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} DevHire. Built for developers.
      </footer>
    </div>
  );
};

export default Landing;
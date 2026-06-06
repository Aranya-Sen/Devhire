import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import StatsCard from '../../components/dashboard/StatsCard';
import PipelineChart from '../../components/dashboard/PipelineChart';
import PipelineBadge from '../../components/applications/PipelineBadge';

const CompanyHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/companies/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here's your recruitment overview</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Total Jobs Posted" value={stats?.jobs?.total_jobs || 0} icon="📋" />
        <StatsCard label="Open Jobs" value={stats?.jobs?.open_jobs || 0} icon="🟢" />
        <StatsCard label="Closed Jobs" value={stats?.jobs?.closed_jobs || 0} icon="🔴" />
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Applications by Pipeline Stage</h2>
        <PipelineChart data={stats?.pipeline_breakdown} />
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Applications</h2>
        {stats?.recent_applications?.length === 0 ? (
          <p className="text-gray-400 text-sm">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {stats?.recent_applications?.map((app) => (
              <div key={app.id} className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{app.candidate_name}</p>
                  <p className="text-xs text-gray-400">{app.job_title} · CGPA {app.cgpa}</p>
                </div>
                <PipelineBadge stage={app.pipeline_stage} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/company/post-job"
          className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition text-center">
          <div className="text-2xl mb-2">➕</div>
          <p className="font-semibold text-sm">Post a New Job</p>
        </Link>
        <Link to="/company/jobs"
          className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:shadow-md transition text-center">
          <div className="text-2xl mb-2">💼</div>
          <p className="font-semibold text-sm text-gray-800">Manage Jobs</p>
        </Link>
        <Link to="/company/profile"
          className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:shadow-md transition text-center">
          <div className="text-2xl mb-2">🏢</div>
          <p className="font-semibold text-sm text-gray-800">Company Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default CompanyHome;
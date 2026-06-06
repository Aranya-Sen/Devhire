import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import StatsCard from '../../components/dashboard/StatsCard';
import PipelineChart from '../../components/dashboard/PipelineChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/devhire-admin/stats');
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
    <div className="px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Platform-wide overview</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Candidates" value={stats?.total_candidates || 0} icon="👤" />
        <StatsCard label="Total Companies" value={stats?.total_companies || 0} icon="🏢" />
        <StatsCard label="Total Jobs" value={stats?.total_jobs || 0} icon="💼" />
        <StatsCard label="Total Applications" value={stats?.total_applications || 0} icon="📋" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Applications by Pipeline Stage</h2>
        <PipelineChart data={stats?.pipeline_breakdown} />
      </div>
    </div>
  );
};

export default AdminDashboard;
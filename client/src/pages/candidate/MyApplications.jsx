import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import PipelineBadge from '../../components/applications/PipelineBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications/my');
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not withdraw');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center text-gray-400 py-20">You haven't applied to any jobs yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{app.job_title}</h3>
                  <p className="text-gray-500 text-sm">{app.company_name} · {app.location}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Applied on {new Date(app.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <PipelineBadge stage={app.pipeline_stage} />
              </div>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={app.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Submitted Resume →
                </a>

                {app.pipeline_stage === 'Applied' && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
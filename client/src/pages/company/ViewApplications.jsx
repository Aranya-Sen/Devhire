import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import PipelineBadge from '../../components/applications/PipelineBadge';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const ViewApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get(`/api/applications/job/${jobId}`),
          api.get(`/api/jobs/${jobId}`)
        ]);
        setApplications(appRes.data.applications);
        setJobTitle(jobRes.data.job.title);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStageChange = async (appId, newStage) => {
    setUpdatingId(appId);
    try {
      const res = await api.patch(`/api/applications/${appId}/stage`, {
        pipeline_stage: newStage
      });
      setApplications((prev) =>
        prev.map((a) => a.id === appId ? { ...a, pipeline_stage: res.data.application.pipeline_stage } : a)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4 block">
        ← Back to Jobs
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Applications</h1>
      <p className="text-gray-500 text-sm mb-6">For: {jobTitle}</p>

      {applications.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No applications received yet.</div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{app.name}</h3>
                  <p className="text-gray-500 text-sm">{app.email}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {app.college} · CGPA {app.cgpa} · Class of {app.year_of_graduation}
                  </p>
                </div>
                <PipelineBadge stage={app.pipeline_stage} />
              </div>

              <div className="flex justify-between items-center mt-4">
                <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline">
                  View Resume →
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Move to:</span>
                  <select
                    value={app.pipeline_stage}
                    onChange={(e) => handleStageChange(app.id, e.target.value)}
                    disabled={updatingId === app.id}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Applied on {new Date(app.created_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
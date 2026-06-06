import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import PipelineBadge from '../../components/applications/PipelineBadge';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError('');
    try {
      await api.post(`/api/applications/${id}`);
      setApplied(true);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader />;
  if (!job) return <div className="text-center py-20 text-gray-400">Job not found.</div>;

  const isExpired = new Date(job.last_date) < new Date();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Back to Jobs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company_name} · {job.company_address}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>📍 <span className="font-medium">{job.location}</span></div>
          <div>💼 <span className="font-medium capitalize">{job.job_type}</span></div>
          <div>🎓 <span className="font-medium">Min CGPA: {job.min_cgpa}</span></div>
          <div>📅 <span className="font-medium">
            Apply by: {new Date(job.last_date).toLocaleDateString('en-IN')}
          </span></div>
        </div>

        {job.tech_stack?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {job.tech_stack.map((tech) => (
                <span key={tech} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.description && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-2">Job Description</p>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{success}</p>}

        {!applied && !isExpired && job.status === 'open' && (
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {applying ? 'Submitting...' : 'Apply Now'}
          </button>
        )}

        {isExpired && (
          <p className="text-center text-red-500 text-sm font-medium">Application deadline has passed.</p>
        )}
        {job.status === 'closed' && (
          <p className="text-center text-gray-400 text-sm font-medium">This job is no longer accepting applications.</p>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
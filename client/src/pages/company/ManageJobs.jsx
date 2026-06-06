import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/companies/profile');
        const companyId = res.data.company.id;
        const jobsRes = await api.get(`/api/companies/${companyId}/jobs`);
        // Also get closed jobs — public endpoint only returns open
        // So use admin-style but scoped: get all jobs for this company
        const allJobsRes = await api.get('/api/jobs');
        const myJobs = allJobsRes.data.jobs.filter(
          (j) => j.company_id === companyId || j.company_name === res.data.company.name
        );
        setJobs(myJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? All applications will also be deleted.')) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const res = await api.put(`/api/jobs/${job.id}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => j.id === job.id ? res.data.job : j));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
        <Link to="/company/post-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No jobs posted yet.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.location} · {job.job_type}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Apply by: {new Date(job.last_date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/company/jobs/${job.id}/applications`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View Applications
                </Link>
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
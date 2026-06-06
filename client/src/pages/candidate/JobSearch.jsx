import { useState, useEffect } from 'react';
import api from '../../api/axios';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import Loader from '../../components/common/Loader';

const defaultFilters = {
  search: '', location: '', job_type: '', tech_stack: '', min_cgpa: ''
};

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [applied, setApplied] = useState(false);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))
      ).toString();
      const res = await api.get(`/api/jobs${query ? `?${query}` : ''}`);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied(true);
    fetchJobs(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setApplied(false);
    fetchJobs();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Jobs</h1>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div className="w-64 shrink-0">
          <form onSubmit={handleSearch}>
            <JobFilters filters={filters} onChange={handleChange} onReset={handleReset} />
            <button type="submit"
              className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Job list */}
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              {applied ? 'No jobs match your filters.' : 'No jobs available right now.'}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
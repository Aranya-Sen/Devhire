import { Link } from 'react-router-dom';

const jobTypeStyles = {
  'full-time': 'bg-blue-50 text-blue-700',
  'part-time': 'bg-yellow-50 text-yellow-700',
  'contract': 'bg-orange-50 text-orange-700',
  'internship': 'bg-green-50 text-green-700',
};

const JobCard = ({ job }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
        <p className="text-gray-500 text-sm">{job.company_name}</p>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${jobTypeStyles[job.job_type] || 'bg-gray-100 text-gray-600'}`}>
        {job.job_type}
      </span>
    </div>

    <div className="flex flex-wrap gap-2 mb-3">
      {job.tech_stack?.map((tech) => (
        <span key={tech} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
          {tech}
        </span>
      ))}
    </div>

    <div className="flex justify-between items-center text-sm text-gray-500">
      <div className="flex gap-4">
        <span>📍 {job.location}</span>
        <span>🎓 Min CGPA: {job.min_cgpa}</span>
      </div>
      <Link
        to={`/candidate/jobs/${job.id}`}
        className="text-blue-600 font-medium hover:underline text-sm"
      >
        View →
      </Link>
    </div>

    <p className="text-xs text-gray-400 mt-3">
      Apply by: {new Date(job.last_date).toLocaleDateString('en-IN')}
    </p>
  </div>
);

export default JobCard;
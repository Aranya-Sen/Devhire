const JobFilters = ({ filters, onChange, onReset }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
    <h3 className="font-semibold text-gray-800">Filter Jobs</h3>

    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
      <input
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Title or keyword"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
      <input
        name="location"
        value={filters.location}
        onChange={onChange}
        placeholder="e.g. Bangalore"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Job Type</label>
      <select
        name="job_type"
        value={filters.job_type}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Tech Stack</label>
      <input
        name="tech_stack"
        value={filters.tech_stack}
        onChange={onChange}
        placeholder="e.g. React,Node.js"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Min CGPA (your CGPA or above)</label>
      <input
        name="min_cgpa"
        type="number"
        step="0.1"
        min="0"
        max="10"
        value={filters.min_cgpa}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      onClick={onReset}
      className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
    >
      Reset Filters
    </button>
  </div>
);

export default JobFilters;
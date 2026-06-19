import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/devhire-admin/candidates');
        setCandidates(res.data.candidates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate? This cannot be undone.')) return;
    try {
      await api.delete(`/devhire-admin/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewResume = async () => {
  try {
    const key = profile.resume_url.split('.amazonaws.com/')[1];
    const res = await api.post('/api/upload/resume/view-url', { key });
    window.open(res.data.url, '_blank');
  } catch (err) {
    alert('Could not load resume');
  }
};

  if (loading) return <Loader />;

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Candidates</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Email', 'College', 'CGPA', 'Graduation', 'Resume', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-10">No candidates found.</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500">{c.college || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.cgpa || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.year_of_graduation || '—'}</td>
                  <td className="px-4 py-3">
                    {c.resume_url ? (
                      <button
                        onClick={handleViewResume}
                        className="text-blue-600 hover:underline text-sm">
                          View
                      </button>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCandidates;
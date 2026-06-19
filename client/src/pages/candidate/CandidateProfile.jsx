import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const CandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/candidates/profile');
        setProfile(res.data.candidate);
        setForm({
          ...res.data.candidate,
          preferred_locations: res.data.candidate.preferred_locations?.join(', ') || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        cgpa: parseFloat(form.cgpa),
        year_of_graduation: parseInt(form.year_of_graduation),
        preferred_locations: form.preferred_locations
          .split(',').map(l => l.trim()).filter(Boolean)
      };
      const res = await api.put('/api/candidates/profile', payload);
      setProfile(res.data.candidate);
      setEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    setError('Only PDF files are allowed');
    return;
  }

  setUploading(true);
  setError('');
  setSuccess('');

  try {
    // Step 1 — get pre-signed URL from backend
    const presignRes = await api.post('/api/upload/resume/presign', {
      fileName: file.name,
      contentType: file.type
    });

    const { uploadUrl, key, fileUrl } = presignRes.data;

    // Step 2 — upload directly to S3 using pre-signed URL
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    // Step 3 — confirm upload with backend to save URL in DB
    const confirmRes = await api.post('/api/upload/resume/confirm', {
      fileUrl,
      key
    });

    setProfile((prev) => ({ ...prev, resume_url: confirmRes.data.resume_url }));
    setSuccess('Resume uploaded successfully');
  } catch (err) {
    setError(err.response?.data?.message || 'Upload failed');
  } finally {
    setUploading(false);
  }
};

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
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Edit Profile
          </button>
        )}
      </div>

      {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{success}</p>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {!editing ? (
          <div className="space-y-4 text-sm">
            {[
              ['Name', profile.name],
              ['Email', profile.email],
              ['Date of Birth', profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN') : '—'],
              ['Gender', profile.gender || '—'],
              ['College', profile.college || '—'],
              ['Year of Graduation', profile.year_of_graduation || '—'],
              ['CGPA', profile.cgpa || '—'],
              ['Preferred Locations', profile.preferred_locations?.join(', ') || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}

            {/* Resume */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500 font-medium">Resume</span>
              <div className="flex items-center gap-3">
                {profile.resume_url ? (
                  <button
                    onClick={handleViewResume}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Resume
                  </button>
                ) : (
                  <span className="text-gray-400">No resume uploaded</span>
                )}
                <button onClick={() => fileRef.current.click()}
                  disabled={uploading}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload New'}
                </button>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'College', name: 'college', type: 'text' },
              { label: 'Year of Graduation', name: 'year_of_graduation', type: 'number' },
              { label: 'CGPA', name: 'cgpa', type: 'number', step: '0.01', min: '0', max: '10' },
            ].map(({ label, name, ...rest }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input name={name} value={form[name] || ''} onChange={handleChange} {...rest}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={form.gender || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Locations <span className="text-gray-400 font-normal">(comma separated)</span>
              </label>
              <input name="preferred_locations" value={form.preferred_locations || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
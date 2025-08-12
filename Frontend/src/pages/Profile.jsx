import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyProfile, getProfileByUsername, updateProfile } from '../utils/api';
import { Edit, Save, X, Loader2, Shield, Building } from 'lucide-react';

const Profile = () => {
  const { username: routeUsername } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !routeUsername;

  // --- Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = routeUsername
          ? await getProfileByUsername(routeUsername)
          : await getMyProfile();

        setUser(data);
        setFormData({ ...data });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [routeUsername]);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Save Changes ---
  const handleSave = async () => {
    setSaving(true);
    setError('');
    const updatedData = { username: formData.username };

    if(user.role==='admin' && formData.club!==undefined)
        updatedData.clubName = formData.clubName;

    try {
      const updated = await updateProfile(updatedData);
      setUser(updated);
      setFormData(updated)
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
    setError('');
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow">
          <h2 className="text-red-600 text-xl">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-600 hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow">
          <h2 className="text-gray-800 text-xl">Profile not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 h-20"></div>

          <div className="px-6 pb-6">
            {/* Username & Role */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between -mt-10 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  @{formData.username}
                </h1>
                <div className="flex items-center mt-1 text-gray-600">
                  <Shield className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>

              {/* Edit / Save Buttons */}
              {isOwnProfile && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 transition"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">@{user.username}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>

              {/* Club Name (Admin only) */}
              {user.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="clubName"
                      value={formData.clubName || ''}
                      onChange={handleChange}
                      placeholder="Enter club name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.clubName || '—'}</p>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { X, User, Mail, Phone, Hash, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegistrationForm = ({ event, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    registrationNum: '',
    phone: '',
    teamSize: 1,
    teamMembers: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.registrationNum.trim()) {
      newErrors.registrationNum = 'Registration number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (formData.teamSize < 1 || formData.teamSize > event.team_size) {
      newErrors.teamSize = `Team size must be between 1 and ${event.team_size}`;
    }

    if (formData.teamSize > 1 && !formData.teamMembers.trim()) {
      newErrors.teamMembers = 'Team members are required for team registration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        userId: user.id
      });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Register for Event
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {event.event_name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Hash className="h-4 w-4 inline mr-1" />
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNum"
              value={formData.registrationNum}
              onChange={handleChange}
              className={`input-field ${errors.registrationNum ? 'border-red-500' : ''}`}
              placeholder="Enter your registration number"
            />
            {errors.registrationNum && (
              <p className="text-red-500 text-xs mt-1">{errors.registrationNum}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="h-4 w-4 inline mr-1" />
              Team Size (Max: {event.team_size})
            </label>
            <select
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              className={`input-field ${errors.teamSize ? 'border-red-500' : ''}`}
            >
              {Array.from({ length: event.team_size }, (_, i) => i + 1).map(size => (
                <option key={size} value={size}>
                  {size} {size === 1 ? 'member' : 'members'}
                </option>
              ))}
            </select>
            {errors.teamSize && (
              <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>
            )}
          </div>

          {/* Team Members */}
          {formData.teamSize > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Members
              </label>
              <textarea
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                rows={formData.teamSize}
                className={`input-field ${errors.teamMembers ? 'border-red-500' : ''}`}
                placeholder="Enter team member names (one per line)"
              />
              {errors.teamMembers && (
                <p className="text-red-500 text-xs mt-1">{errors.teamMembers}</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  Registering...
                </div>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
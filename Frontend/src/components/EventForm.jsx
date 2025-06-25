import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Mail, Award, FileText, Image } from 'lucide-react';
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


const EventForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_date: '',
    time: '',
    venue: '',
    club_name: '',
    team_size: 1,
    organizer_email: '',
    rewards: '',
    poster: ''
  });

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

    if (!formData.event_name.trim()) newErrors.event_name = 'Event name is required';
    if (!formData.event_description.trim()) newErrors.event_description = 'Description is required';
    if (!formData.event_date) newErrors.event_date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.club_name.trim()) newErrors.club_name = 'Club name is required';
    if (!formData.organizer_email.trim()) {
      newErrors.organizer_email = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.organizer_email)) {
      newErrors.organizer_email = 'Invalid email';
    }
    if (formData.team_size < 1 || formData.team_size > 20) newErrors.team_size = 'Team size must be 1–20';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let cloudinaryPosterUrl = '';

    if (formData.poster) {
      const imageData = new FormData();
      imageData.append('file', formData.poster);
      imageData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: imageData,
          }
        );

        const result = await response.json();
        cloudinaryPosterUrl = result.secure_url;
      } catch (err) {
        alert('Image upload failed');
        console.error(err);
        return;
      }
  }

  const finalData = {
    ...formData,
    event_date: new Date(`${formData.event_date}T${formData.time}`).toISOString(),
    poster: cloudinaryPosterUrl, 
  };

  delete finalData.time;

  onSubmit(finalData);
};


  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" /> Event Name
          </label>
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            className={`input-field ${errors.event_name ? 'border-red-500' : ''}`}
            placeholder="Enter event name"
          />
          {errors.event_name && <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
          <input
            type="text"
            name="club_name"
            value={formData.club_name}
            onChange={handleChange}
            className={`input-field ${errors.club_name ? 'border-red-500' : ''}`}
            placeholder="Enter club name"
          />
          {errors.club_name && <p className="text-red-500 text-xs mt-1">{errors.club_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
          <textarea
            name="event_description"
            value={formData.event_description}
            onChange={handleChange}
            rows={4}
            className={`input-field ${errors.event_description ? 'border-red-500' : ''}`}
            placeholder="Describe your event..."
          />
          {errors.event_description && <p className="text-red-500 text-xs mt-1">{errors.event_description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" /> Event Date
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className={`input-field ${errors.event_date ? 'border-red-500' : ''}`}
            />
            {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" /> Event Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`input-field ${errors.time ? 'border-red-500' : ''}`}
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" /> Venue
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className={`input-field ${errors.venue ? 'border-red-500' : ''}`}
            placeholder="Event location"
          />
          {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" /> Team Size
          </label>
          <select
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
            className={`input-field ${errors.team_size ? 'border-red-500' : ''}`}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map(size => (
              <option key={size} value={size}>{size} {size === 1 ? 'member' : 'members'}</option>
            ))}
          </select>
          {errors.team_size && <p className="text-red-500 text-xs mt-1">{errors.team_size}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" /> Organizer Email
          </label>
          <input
            type="email"
            name="organizer_email"
            value={formData.organizer_email}
            onChange={handleChange}
            className={`input-field ${errors.organizer_email ? 'border-red-500' : ''}`}
            placeholder="Enter email"
          />
          {errors.organizer_email && <p className="text-red-500 text-xs mt-1">{errors.organizer_email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Award className="h-4 w-4 inline mr-1" /> Rewards (Optional)
          </label>
          <input
            type="text"
            name="rewards"
            value={formData.rewards}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Trophies, Certificates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="h-4 w-4 inline mr-1" /> Upload Poster
          </label>
          <input
            type="file"
            name="poster"
            accept="image/*"
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                poster: e.target.files[0]
              }))
            }
            className="input-field"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner h-5 w-5 mr-2"></div>
                Creating Event...
              </div>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

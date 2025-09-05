import React, { useState } from 'react';
import { Calendar, MapPin, Users, Award, Mail, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RegistrationForm from './RegistrationForm';

const EventDetail = ({ event, onClose, onRegister }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      onClose();
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = async (registrationData) => {
    try {
      await onRegister(event.event_name, registrationData);
      setShowRegistrationForm(false);
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (showRegistrationForm) {
    return (
      <RegistrationForm
        event={event}
        onSubmit={handleRegistrationSubmit}
        onCancel={() => setShowRegistrationForm(false)}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {event.event_name}
            </h2>
            <p className="text-lg text-primary-600 font-medium">
              {event.club_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Poster */}
          {event.poster && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={event.poster}
                alt={event.event_name}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-primary-500" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-gray-600">{formatDate(event.event_date)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-primary-500" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-gray-600">{formatTime(event.event_date)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-primary-500" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600">{event.venue}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-primary-500" />
                <div>
                  <p className="font-medium">Team Size</p>
                  <p className="text-sm text-gray-600">{event.team_size} members</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-primary-500" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-sm text-gray-600">{event.organizer_email}</p>
                </div>
              </div>

              {event.rewards && (
                <div className="flex items-start text-gray-700">
                  <Award className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Rewards</p>
                    <p className="text-sm text-gray-600">{event.rewards}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About This Event
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {event.event_description}
            </p>
          </div>

          {!isAdmin && (
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleRegisterClick}
                className="w-full btn-primary py-3 text-lg font-semibold"
              >
                {isAuthenticated ? 'Register for Event' : 'Login to Register'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
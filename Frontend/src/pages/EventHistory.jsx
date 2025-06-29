import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserRegistrations } from '../utils/api';
import Navbar from '../components/Navbar';

const EventHistory = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getUserRegistrations();
      console.log(data);
      setRegistrations(data.events);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event History
              </h1>
              <p className="text-gray-600 mt-1">
                View all events you've registered for
              </p>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading your registrations...</span>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No registrations yet
            </h3>
            <p className="text-gray-600">
              You haven't registered for any events yet. Check out the events page to find exciting events to join!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <div
                key={registration._id}
                className={`card p-6 ${
                  isEventPast(registration.event.event_date) 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {registration.event.poster && (
                        <img
                          src={registration.event.poster}
                          alt={registration.event.event_name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {registration.event.event_name}
                          </h3>
                          {isEventPast(registration.event.event_date) && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                              Past Event
                            </span>
                          )}
                        </div>
                        <p className="text-primary-600 font-medium mb-3">
                          {registration.event.clubName}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                            <span>{formatDate(registration.event.event_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                            <span>{registration.event.venue}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary-500" />
                            <span>Team Size: {registration.teamSize}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Details */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 lg:w-80">
                    <div className="bg-primary-50 rounded-lg p-4">
                      <h4 className="font-medium text-primary-900 mb-3">
                        Registration Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Registered as:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {registration.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {registration.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reg. No:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {registration.registrationNum}
                          </span>
                        </div>
                        {registration.teamMembers && (
                          <div>
                            <span className="text-gray-600">Team Members:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {registration.teamMembers}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-primary-200">
                          <span className="text-gray-600">Registered on:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(registration.register_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventHistory;
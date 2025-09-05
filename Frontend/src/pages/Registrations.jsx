import React, { useState, useEffect } from 'react';
import { Users, Calendar, Trash2, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminEvents, deleteEvent } from '../utils/api';
import Navbar from '../components/Navbar';
import StudentListModal from '../components/StudentListModal';
import toast from 'react-hot-toast';

const Registrations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAdminEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(eventId);
    try {
      await deleteEvent(eventId, user.id);
      setEvents(events.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Registrations
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your events and view student registrations
            </p>
          </div>
          <Link
            to="/create-event"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Events Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events created yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first event to start managing registrations
            </p>
            <Link
              to="/create-event"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-6 font-medium text-gray-900">
                      Event Details
                    </th>
                    <th className="text-left p-6 font-medium text-gray-900">
                      Date Created
                    </th>
                    <th className="text-left p-6 font-medium text-gray-900">
                      Event Date
                    </th>
                    <th className="text-center p-6 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="p-6">
                        <div className="flex items-start space-x-4">
                          {event.poster && (
                            <img
                              src={event.poster}
                              alt={event.event_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {event.event_name}
                            </h3>
                            <p className="text-sm text-primary-600 mb-1">
                              {event.club_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {event.venue}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-gray-600">
                        {formatDate(event.created_at)}
                      </td>
                      <td className="p-6 text-gray-600">
                        {formatDate(event.event_date)}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View List</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={deleteLoading === event._id}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === event._id ? (
                              <div className="loading-spinner h-4 w-4"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Student List Modal */}
      {selectedEvent && (
        <StudentListModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Registrations;

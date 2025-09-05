import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEvents, searchEvents, registerForEvent } from '../utils/api';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventDetail from '../components/EventDetail';
import toast from 'react-hot-toast';  

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      toast.error('Error fetching events');   
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const results = await searchEvents(query);
      setFilteredEvents(results);
    } catch (error) {
      toast.error('Error searching events');   
    }
  };

  const handleEventClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/', eventId: event.id } });
      return;
    }
    setSelectedEvent(event);
  };

  const handleRegister = async (eventId, registrationData) => {
    try {
      await registerForEvent(eventId, registrationData);
      toast.success('Registration successful! 🎉');   
    } catch (error) {
      toast.error('Registration failed: ' + error.message);   
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} /> {/*navbar component with search functionality */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join exciting events, competitions, and workshops happening at your college
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600">
                  No events match your search for "{searchQuery}". Try different keywords.
                </p>
              </div>
            ) : (
              <div>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events available
                </h3>
                <p className="text-gray-600">
                  There are no events scheduled at the moment. Check back later!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && filteredEvents.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default Home;
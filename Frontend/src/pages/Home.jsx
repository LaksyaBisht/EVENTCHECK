import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEvents, searchEvents, registerForEvent } from '../utils/api';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventDetail from '../components/EventDetail';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); //all events
  const [filteredEvents, setFilteredEvents] = useState([]);   //filtered events
  const [loading, setLoading] = useState(true);   //loading state
  const [selectedEvent, setSelectedEvent] = useState(null);   //view selected event details
  const [searchQuery, setSearchQuery] = useState('');   //search keyword

  //fetch events on page load
  useEffect(() => {
    fetchEvents();
  }, []);


  //show fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents(); //calls backend via getEvents()
      setEvents(data);
      setFilteredEvents(data);  //set both events and filtered events to fetched data 
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };


  //show search events
  const handleSearch = async (query) => {
    setSearchQuery(query);// search query
    try {
      const results = await searchEvents(query);// from backend
      setFilteredEvents(results);//selects the events returned from backend through search query
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  //click on an event card
  const handleEventClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/', eventId: event.id } });//redirect to login if not authenticated
      return;
    }
    setSelectedEvent(event);
  };


  //register button on the event detail modal
  const handleRegister = async (eventId, registrationData) => {
    try {
      await registerForEvent(eventId, registrationData);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed: ' + error.message);
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
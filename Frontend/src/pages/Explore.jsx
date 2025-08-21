import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTrendingEvents, registerForEvent } from '../utils/api'; 
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventDetail from '../components/EventDetail';

const Explore = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedEvent, setSelectedEvent] = useState(null); 

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getTrendingEvents(); 
        setEvents(data); 
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); 
  
  const handleEventClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/explore', eventId: event.id } });
      return;
    }
    setSelectedEvent(event);
  };

  const handleRegister = async (eventId, registrationData) => {
    try {
      await registerForEvent(eventId, registrationData);
      alert('Registration successful!'); 
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  // Carousel navigation functions
  const handleNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Navbar /> 
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header content with "Welcome to" and a larger gap below */}
        <p className="text-sm text-gray-500 font-medium tracking-wide">Welcome to</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          EventCheck Explore
        </h1>

        {/* Section title for Trending Events with increased top margin */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Trending Events
          </h2>
        </div>

        {/* The Carousel Container */}
        <div className="relative">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            className={`absolute top-1/2 -left-4 z-10 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-gray-800 transition-transform hover:scale-110 ${currentIndex === 0 ? 'hidden' : ''}`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className={`absolute top-1/2 -right-4 z-10 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-gray-800 transition-transform hover:scale-110 ${currentIndex === events.length - 1 ? 'hidden' : ''}`}
          >
            <ChevronRight size={24} />
          </button>

          {/* The Events Track - this is what moves */}
          <div
            ref={carouselRef}
            className="flex space-x-4 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 336}px)` }} // 336px = 320px (card width) + 16px (space-x-4)
          >
            {loading ? (
              <div className="flex items-center justify-center py-12 w-full">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                <span className="ml-3 text-gray-600">Loading trending events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 w-full">
                <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trending events available
                </h3>
                <p className="text-gray-600">
                  There are no popular events at the moment. Check back later for new trends!
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="flex-none w-80">
                  <EventCard
                    event={event}
                    onClick={handleEventClick}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Event Detail Modal, conditionally rendered */}
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

export default Explore;

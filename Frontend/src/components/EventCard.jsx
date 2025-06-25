import React from 'react';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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


  return (
    <div 
      className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in group"
      onClick={() => onClick(event)}
    >
      {/* Event Poster */}
      {event.poster && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={event.poster}
            alt={event.event_name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Event Content */}
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {event.event_name}
          </h3>
          <p className="text-sm text-primary-600 font-medium mt-1">
            {event.club_name}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {event.event_description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-primary-500" />
            <span>{formatDate(event.event_date)} at {formatTime(event.event_date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-primary-500" />
            <span>Team Size: {event.team_size}</span>
          </div>
          
          {event.rewards && (
            <div className="flex items-center text-sm text-gray-500">
              <Award className="h-4 w-4 mr-2 text-primary-500" />
              <span className="truncate">{event.rewards}</span>
            </div>
          )}
        </div>

        {/* Action Indicator */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700">
            Click to view details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
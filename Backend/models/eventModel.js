const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: { 
    type: String, 
    required: true, 
    maxlength: 255 
  },
  event_date: { 
    type: Date, 
    required: true 
  },
  event_description: { 
    type: String 
  },
  club_name: { 
    type: String, 
    maxlength: 255 
  },
  venue: { 
    type: String, 
    maxlength: 255 
  },
  team_size: { 
    type: Number, 
    default: 1, 
    min: 1 
  },
  organizer_email: { 
    type: String, 
    maxlength: 255 
  },
  rewards: { 
    type: String, 
    maxlength: 255 
  },
  poster: { 
    type: String, 
    default: '' 
  },
  created_by: { 
    type: String, 
    maxlength: 255 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

const events = mongoose.model('events', eventSchema);

module.exports = events;

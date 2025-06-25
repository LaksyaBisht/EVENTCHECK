const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    maxlength: 50 
  },
  email: { 
    type: String, 
    required: true, 
    maxlength: 100, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true, 
    maxlength: 255 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['participant', 'admin'] 
  },
  clubName: { 
    type: String,
    maxlength: 100, 
    required: function () {
      return this.role === 'admin';
    }
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

const users = mongoose.model('users', userSchema);

module.exports = users;
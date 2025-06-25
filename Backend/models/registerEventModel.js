const mongoose = require('mongoose');

const registerEventSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    name: {
        type: String, 
        required: true,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    registrationNum: {
        type: String,
        required: true,
        maxlength: 255
    },
    phone: {
        type:String, 
        required: true,
        maxlength: 255,
        match: [/^\d{10}$/, 'Invalid phone number']
    },
    teamSize: {
        type: Number,
        required: true,
    },
    teamMembers: {
        type: String, 
        required: true,
        maxlength: 255
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    register_at: { 
        type: Date, 
        default: Date.now 
    }
})

const registerEvents = mongoose.model('registerEvents', registerEventSchema);
module.exports = registerEvents;

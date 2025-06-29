const Event = require('../models/eventModel');

const searchEvents = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const results = await Event.find({
      $or: [
        { event_name: new RegExp(query, 'i') },
        { club_name: new RegExp(query, 'i') },
        { event_description: new RegExp(query, 'i') }
      ]
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = await Event.find({event_date: { $gt: today}
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getEventByName = async (req, res) => {
    const event_name = req.params.event_name;
  
    try {
      const result = await Event.findOne({ event_name });
      if (!result) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(result);
    } catch (err) {
      console.error(err); 
      res.status(500).json({ message: 'Error fetching event details' });
    }
  };
  

const createEvent = async (req, res) => {
  try {
    const userId = req.user?.id;

    const eventData = {
      ...req.body,
      created_by: userId, 
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(200).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};


const getAdminEvents = async(req, res)=>{
  const adminId = req.user?.id;

  try{
    const events = await Event.find({created_by: adminId});
    res.status(200).json({
      message: "Events fetched successfully",
      data: events
    });
  }
  catch(error){
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

const deleteEvent = async(req, res)=>{
  try{
    const eventName = req.params.event_name;
    const event = await Event.findOneAndDelete({event_name: eventName});
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
  }
};

module.exports = {
  searchEvents,
  getAllEvents,
  getEventByName,
  createEvent,
  getAdminEvents,
  deleteEvent
};

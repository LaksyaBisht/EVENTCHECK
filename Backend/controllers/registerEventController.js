const registerEvents = require("../models/registerEventModel");
const Event = require('../models/eventModel');


const registerEvent = async (req, res) => {
  const event_name = req.params.event_name;
  try {
    const event = await Event.findOne({ event_name });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const { name, email, registrationNum, phone, teamSize, teamMembers } = req.body;

    const newRegistration = new registerEvents({
      event:event._id,
      name,
      email,
      registrationNum,
      phone,
      teamSize,
      teamMembers: teamMembers || "",
      userId: req.user?.id
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json({
      message: "Registration successful",
      data: savedRegistration,
    });
  } catch (error) {
    console.error("Error while registering for the event:", error);
    res.status(500).json({
      message: "Failed to register for the event",
      error: error.message,
    });
  }
};

const getRegistrationsByEvent = async (req, res) => {
  const eventID = req.params.eventId;
  
  try {
    const students = await registerEvents.find({ event: eventID });

    res.status(200).json({
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const userID = req.user?.id;
    const events = await registerEvents.find({ userId: userID }).populate('event');
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerEvent, getRegistrationsByEvent, getHistory};

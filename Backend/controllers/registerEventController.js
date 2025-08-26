import registerEvents from "../models/registerEventModel.js";
import Event from "../models/eventModel.js";
import { client } from '../lib/redis.js';

const expiryTime = 15 * 60;

export const registerEvent = async (req, res) => {
  const event_name = req.params.event_name;
  try {
    const event = await Event.findOne({ event_name });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const { name, email, registrationNum, phone, teamSize, teamMembers } = req.body;

    const newRegistration = new registerEvents({
      event: event._id,
      name,
      email,
      registrationNum,
      phone,
      teamSize,
      teamMembers: teamMembers || '',
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

export const getRegistrationsByEvent = async (req, res) => {
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

export const getHistory = async (req, res) => {
  try {
    const userID = req.user?.id;
    const events = await registerEvents.find({ userId: userID }).populate('event');
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTrendingEvents = async (req, res) => {
  try {
    const trendingEvents = await registerEvents.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: "$eventDetails",
      },
      {
        $match: {
          "eventDetails.event_date": { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 },
          eventDetails: { $first: "$eventDetails" }
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          eventId: "$_id",
          count: 1,
          event_name: "$eventDetails.event_name",
          event_date: "$eventDetails.event_date",
          event_description: "$eventDetails.event_description",
          club_name: "$eventDetails.club_name",
          venue: "$eventDetails.venue",
          poster: "$eventDetails.poster",
          organizer_email: "$eventDetails.organizer_email",
          team_size: "$eventDetails.team_size",
        },
      },
    ]);

    const jsonEvents = JSON.stringify(trendingEvents);

    await client.set('trendingEvents', jsonEvents, {
      EX: expiryTime
    });
    return res.status(200).json({ success: true, trendingEvents });
  } catch (error) {
    console.error("Error fetching trending events:", error);
    return res.status(500).json({ message: "Failed to fetch trending events", error: error.message });
  }
};
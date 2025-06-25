import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, 
});

//Automatically attaches the JWT token to every request
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('eventcheck_user');
  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const signupUser = async (userData) => {
  const res = await API.post('/register', userData);
  return res.data; 
};

export const loginUser = async (email, password) => {
  const res = await API.post('/login', { email, password });
  return {
    ...res.data.user,
    token: res.data.token
  };
};

// Event APIs

export const getEvents = async () => {
  const res = await API.get('/event');
  return res.data;
};

export const getEventByName = async (event_name) => {
  const res = await API.get(`/event/event-details/${event_name}`);
  return res.data; 
};

export const createEvent = async (eventData) => {
  const res = await API.post('/event/create', eventData); 
  return res.data;
};


export const deleteEvent = async (eventId, userId) => {

};

// Registration APIs

export const registerForEvent = async (event_name, registrationData) => {
  const res = await API.post(`/register-event/${event_name}`, registrationData);
  return res.data;
};

export const getUserRegistrations = async (userId) => {
  
};


export const getEventRegistrations = async (eventId) => {
  try{
    const response = await API.get(`/registrations/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getEventRegistrations:', error);
    throw error;
  }
};


export const getAdminEvents = async () => {
  try {
    const response = await API.get('/admin-dashboard');
    return response.data.data;
  } catch (error) {
    console.error('Error in getAdminEvents:', error);
    throw error;
  }
};

export const searchEvents = async (query) => {
  if (!query.trim()) {
    const res = await API.get('/event');
    return res.data;
  }

  const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
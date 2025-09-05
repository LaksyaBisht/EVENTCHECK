import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEvent } from '../utils/api';
import Navbar from '../components/Navbar';
import EventForm from '../components/EventForm';
import toast from 'react-hot-toast';  

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (eventData) => {
    setLoading(true);
    try {
      await createEvent(eventData); 
      toast.success('Event created successfully! 🎉');   
      navigate('/');
    } catch (error) {
      toast.error('Failed to create event: ' + error.message);   
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            // back navigation
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Event
              </h1>
              <p className="text-gray-600 mt-1">
                Fill in the details to create an exciting event for students
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <EventForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;

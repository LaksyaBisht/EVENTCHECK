import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Calendar } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary-600 text-white p-4 rounded-xl">
            <Calendar className="h-12 w-12" />
          </div>
        </div>

        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-6 py-3"
          >
            <Home className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>
          
          <div>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
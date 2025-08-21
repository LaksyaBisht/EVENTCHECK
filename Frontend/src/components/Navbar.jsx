import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Calendar, Plus, Users, History, LogOut, Menu, X, User, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const navItems = isAuthenticated ? (
    isAdmin ? [
      { path: '/', label: 'Events', icon: Calendar },
      { path: '/create-event', label: 'Create', icon: Plus },
      { path: '/registrations', label: 'Registrations', icon: Users }
    ] : [
      { path: '/explore', label: 'Explore', icon: Compass},
      { path: '/', label: 'Events', icon: Calendar },
      { path: '/history', label: 'MyRegistrations', icon: History }
    ]
  ) : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">EVENTCHECK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {onSearch && <SearchBar onSearch={onSearch} />}
            <div className="flex items-center space-x-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Right-side Auth section for Desktop */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <User className="h-6 w-6" />
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1">
                        <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          Welcome, {user?.username}
                        </div>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            console.log("Navigation to /profile");
                            setIsProfileMenuOpen(false);
                            navigate('/profile');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          aria-label='Log out of your account'
                          className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary px-3 py-2 "
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button and profile icon */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsProfileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {onSearch && <SearchBar onSearch={onSearch} />}
              <div className="space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              {/* Mobile Auth (Unauthenticated) inside main menu */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Dropdown for Mobile (Separate from main menu) */}
        {isProfileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-gray-200" ref={profileMenuRef}>
            <div className="py-1">
              <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                Welcome, {user?.username}
              </div>
              <Link
                to="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsProfileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
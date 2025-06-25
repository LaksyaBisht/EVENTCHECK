import React, { useState, useEffect } from 'react';
import { X, Download, Users, Mail, Phone, Hash } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getEventRegistrations } from '../utils/api';

const StudentListModal = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await getEventRegistrations(event._id);
        setRegistrations(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [event._id]);

  const exportToExcel = () => {
    const exportData = registrations.map((reg, index) => ({
      'S.No': index + 1,
      'Name': reg.name,
      'Email': reg.email,
      'Registration No': reg.registrationNum,
      'Phone': reg.phone,
      'Team Size': reg.teamSize,
      'Team Members': reg.teamMembers || 'N/A',
      'Registered At': new Date(reg.register_at).toLocaleString()
    }));

    if(exportData.length === 0)
        return ;

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    
    // Auto-size columns
    const colWidths = [];
    const headers = Object.keys(exportData[0] || {});
    headers.forEach((header, i) => {
      const maxLength = Math.max(
        header.length,
        ...exportData.map(row => String(row[header] || '').length)
      );
      colWidths[i] = { width: Math.min(maxLength + 2, 50) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${event.event_name}_registrations.xlsx`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Student Registrations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {event.event_name}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {registrations.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Download className="h-4 w-4" />
                <span>Export to Excel</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-600">Loading registrations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">Error loading registrations</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Registrations Yet
              </h3>
              <p className="text-gray-600">
                No students have registered for this event yet.
              </p>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-primary-900">
                      Total Registrations: {registrations.length}
                    </span>
                  </div>
                  <div className="text-sm text-primary-700">
                      Total Participants: {registrations.reduce((sum, reg) => sum + (parseInt(reg.teamSize) || 1), 0)}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        S.No
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Name
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Email
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Reg. No
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Phone
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Team Size
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Team Members
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 font-medium text-gray-900">
                        Registered At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration, index) => (
                      <tr key={registration._id} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-100">
                          {index + 1}
                        </td>
                        <td className="p-3 border-b border-gray-100">
                          <div className="flex items-center">
                            <span className="font-medium">{registration.name}</span>
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            {registration.email}
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            {registration.registrationNum}
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            {registration.phone}
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {registration.teamSize}
                          </span>
                        </td>
                        <td className="p-3 border-b border-gray-100 max-w-xs">
                          <div className="text-sm text-gray-600 truncate">
                            {registration.teamMembers || 'N/A'}
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100 text-sm text-gray-600">
                          {new Date(registration.register_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentListModal;
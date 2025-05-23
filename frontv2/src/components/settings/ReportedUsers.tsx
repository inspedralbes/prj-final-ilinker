import React from 'react';
import { Flag, AlertCircle } from 'lucide-react';

const ReportedUsers: React.FC = () => {
  const reports = [
    {
      id: 1,
      user: {
        name: 'John Smith',
        username: '@johnsmith',
        avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      reason: 'Inappropriate content',
      status: 'Under Review',
      reportedDate: '2 days ago',
    },
    {
      id: 2,
      user: {
        name: 'Sarah Wilson',
        username: '@sarahwilson',
        avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      reason: 'Harassment',
      status: 'Resolved',
      reportedDate: '1 week ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reported Users</h2>

      {reports.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <div className="flex justify-center mb-4">
            <Flag className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-500">You haven't reported any users.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start gap-4">
                <img
                  src={report.user.avatarUrl}
                  alt={report.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.user.name}</h3>
                      <p className="text-sm text-gray-500">{report.user.username}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <p>{report.reason}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Reported {report.reportedDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedUsers
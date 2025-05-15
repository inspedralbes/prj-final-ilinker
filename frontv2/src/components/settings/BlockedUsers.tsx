import React, { useState } from 'react';
import { UserX, Search, Unlock } from 'lucide-react';

const BlockedUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const blockedUsers = [
    {
      id: 1,
      name: 'James Wilson',
      username: '@jameswilson',
      avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      blockedDate: '2 days ago',
    },
    {
      id: 2,
      name: 'Emma Thompson',
      username: '@emmathompson',
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      blockedDate: '1 week ago',
    },
    {
      id: 3,
      name: 'Michael Davis',
      username: '@michaeldavis',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      blockedDate: '2 weeks ago',
    },
  ];

  const filteredUsers = blockedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Blocked Users</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-3">
          Users you've blocked won't be able to see your profile, posts, or send you messages.
        </p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search blocked users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg">
          {searchTerm ? (
            <p className="text-gray-500">No blocked users match your search.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <UserX className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500">You haven't blocked any users yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.username}</p>
                <p className="text-xs text-gray-400 mt-1">Blocked {user.blockedDate}</p>
              </div>
              
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Unlock className="h-4 w-4" />
                <span>Unblock</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
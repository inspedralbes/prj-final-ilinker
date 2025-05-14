import React from 'react';
import { ExternalLink, Clock, Trash2 } from 'lucide-react';

const SavedItems: React.FC = () => {
  const savedItems = [
    {
      id: 1,
      title: 'Getting Started with React and TypeScript',
      source: 'Tech Blog',
      url: 'https://example.com/react-typescript',
      thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      savedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Understanding CSS Grid Layout',
      source: 'CSS Tricks',
      url: 'https://example.com/css-grid',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      savedDate: '1 week ago',
    },
    {
      id: 3,
      title: 'The Future of JavaScript in 2025',
      source: 'JavaScript Weekly',
      url: 'https://example.com/js-future',
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      savedDate: '2 weeks ago',
    },
    {
      id: 4,
      title: 'Optimizing React Performance',
      source: 'React Docs',
      url: 'https://example.com/react-perf',
      thumbnail: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      savedDate: '1 month ago',
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Guardados</h2>
      
      {savedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No has guardado nada todavia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-full sm:w-20 h-20 flex-shrink-0">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.source}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Saved {item.savedDate}</span>
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 justify-end items-end">
                <button 
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItems;
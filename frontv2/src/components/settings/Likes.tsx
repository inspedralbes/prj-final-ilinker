import React, { useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';

const Likes: React.FC = () => {
  const likedItems = [
    {
      id: 1,
      title: 'The Art of Modern Web Development',
      author: 'Emily Chen',
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 234,
      likedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Building Scalable Applications',
      author: 'Marcus Johnson',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 189,
      likedDate: '1 week ago',
    },
    {
      id: 3,
      title: 'Design Systems in Practice',
      author: 'Sophie Taylor',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 156,
      likedDate: '2 weeks ago',
    },
  ];

  useEffect(() => {
    apiRequest('my-liked-publications')
    .then((response)=>{
      console.log(response);
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{

    });
  }, []);

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mis me gusta</h2>

      {likedItems.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-500">No has dado me gusta a nada todavia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {likedItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">by {item.author}</p>
                  </div>
                  <a
                    href="#"
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Heart className="h-4 w-4 mr-1 fill-current" />
                    <span>{item.likes}</span>
                  </div>
                  <span className="text-sm text-gray-400">Liked {item.likedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Likes
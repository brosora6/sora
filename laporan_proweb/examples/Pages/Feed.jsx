// src/pages/Feed.jsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, X } from 'lucide-react';

const Feed = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      id: 1,
      image: "/images/feed/horde1.jpg",
      title: "Weekend Riders Meet",
      description: "Great meetup with the crew! Nothing beats a Sunday morning ride with fellow enthusiasts. #RiderCommunity #WeekendRide",
      likes: 234,
      comments: 45,
      date: "2 days ago"
    },
    {
      id: 2,
      image: "/images/feed/bee.jpg",
      title: "Speed Blur",
      description: "Testing the limits on the empty streets. Early morning rides hit different. #StreetRider #MotorcycleLife",
      likes: 567,
      comments: 89,
      date: "3 days ago"
    },
    {
      id: 3,
      image: "/images/feed/ride1.jpg",
      title: "Night Rider",
      description: "Night rides through the city. The streets come alive after dark. #NightRider #CityLights",
      likes: 789,
      comments: 123,
      date: "4 days ago"
    },
    {
      id: 4,
      image: "/images/feed/karyoku1.jpg",
      title: "Custom Build Showcase",
      description: "Showcasing the latest custom build. Black and red never goes out of style. #CustomBike #BikeLife",
      likes: 432,
      comments: 67,
      date: "5 days ago"
    },
    {
      id: 5,
      image: "/images/feed/karyoku.jpg",
      title: "Urban Night",
      description: "Late night photoshoot with the beast. Urban aesthetics at their finest. #NightLife #UrbanRider",
      likes: 876,
      comments: 134,
      date: "1 week ago"
    },
    {
      id: 6,
      image: "/images/feed/feed13.jpg",
      title: "Air Time",
      description: "Weekend motocross action! Getting some serious air time. #Motocross #DirtBike",
      likes: 654,
      comments: 98,
      date: "1 week ago"
    },
    {
      id: 7,
      image: "/images/feed/feed12.jpg",
      title: "Dirt Track Action",
      description: "Kicking up dust at the track. Nothing beats the thrill of racing! #Racing #DirtTrack",
      likes: 543,
      comments: 76,
      date: "1 week ago"
    },
    {
      id: 8,
      image: "/images/feed/feed11.jpg",
      title: "Golden Hour Splash",
      description: "Perfect timing with the sunset. Making waves and memories. #DirtBike #GoldenHour",
      likes: 765,
      comments: 89,
      date: "2 weeks ago"
    },
    {
      id: 9,
      image: "/images/feed/feed14.jpg",
      title: "Battle Scars",
      description: "Every scratch tells a story. The aftermath of an epic ride. #DirtLife #Motorcycle",
      likes: 432,
      comments: 65,
      date: "2 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-10">Feed</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative aspect-square">
                <img 
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.description}</p>
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1">
                      <Heart size={18} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <MessageCircle size={18} />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                  <span className="text-sm">{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal View */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden relative">
              <button 
                className="absolute top-4 right-4 text-white z-10"
                onClick={() => setSelectedPost(null)}
              >
                <X size={24} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square">
                  <img 
                    src={selectedPost.image || "/placeholder.svg"}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
                  <p className="text-gray-400 mb-6">{selectedPost.description}</p>
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2">
                        <Heart size={20} />
                        <span>{selectedPost.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2">
                        <MessageCircle size={20} />
                        <span>{selectedPost.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2">
                        <Share2 size={20} />
                        <span>Share</span>
                      </button>
                    </div>
                    <span className="text-sm">{selectedPost.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;

import { useState } from 'react';
import { Send } from 'lucide-react';


const Notifications = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSend = () => {
    console.log('Sending notification:', { title, description });
    // Add your send logic here
  };

  return (
    <div className="w-full max-w-[768px] mx-auto p-6 bg-gray-800/90 rounded-xl shadow-xl border border-gray-700 backdrop-blur-sm">
      <h1 className="text-center text-gray-100 text-2xl font-bold mb-6">
        Notifications
      </h1>
      
      <div className="flex flex-col gap-6">
        {/* Title Input */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm font-semibold">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title goes here"
            className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm font-semibold">
            Your Text
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description here"
            rows={6}
            className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg border border-blue-600 flex justify-center items-center gap-3 transition-all duration-200 group"
        >
          <Send className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          <span className="text-white text-base font-semibold">
            Send Notification
          </span>
        </button>
      </div>
    </div>
  );
};

export default Notifications
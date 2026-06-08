import React, { useState, useEffect } from 'react';
import { Menu, Bell, Edit, Pencil } from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeDay, setActiveDay] = useState('Monday');
  const [ttsMessage, setTtsMessage] = useState('');

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', '...'];

  const schedules = [
    { id: 1, time: '07.00', type: 'Music', title: 'Indonesia Raya' },
    { id: 2, time: '07.05', type: 'Bel', title: 'Start 1st Class' },
    { id: 3, time: '07.25', type: 'Bel', title: 'Start 2nd Class' },
    { id: 4, time: '07.40', type: 'Bel', title: 'Break' },
    { id: 5, time: '08.20', type: 'Bel', title: 'Start 3rd Class' },
  ];

  // Format jam dan tanggal
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 font-sans">
      
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">SchoolBell</h1>
        <div className="flex items-center gap-6">
          <Menu className="w-6 h-6 cursor-pointer hover:text-gray-300" />
          <Bell className="w-6 h-6 cursor-pointer hover:text-gray-300" />
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold cursor-pointer">
            S
          </div>
          <Edit className="w-6 h-6 cursor-pointer hover:text-gray-300" />
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Schedules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Days Tabs */}
          <div className="flex flex-wrap gap-3">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(day)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeDay === day 
                    ? 'bg-purple-800 text-white' 
                    : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="flex items-center justify-between bg-[#1A1A1A] p-5 rounded-2xl border border-transparent hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-12 w-full">
                  <span className="text-3xl font-bold min-w-[100px]">{schedule.time}</span>
                  <span className="text-gray-400 text-lg w-20">{schedule.type}</span>
                  <span className="text-2xl font-semibold flex-1">{schedule.title}</span>
                </div>
                {schedule.type === 'Music' && (
                   <Pencil className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          
          {/* Clock Widget */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-400 mb-2">{formatDate(currentTime)}</p>
            <h2 className="text-6xl font-bold mb-2 tracking-tighter">{formatTime(currentTime)}</h2>
            <p className="text-xs text-gray-500">Local Time <span className="text-white font-semibold">Jakarta, Indonesia</span></p>
          </div>

          {/* SOS Widget */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Click to Activate the Siren</p>
              <p className="text-xs text-gray-500 mt-1">ONLY FOR EMERGENCY USE</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-900/50">
              SOS
            </button>
          </div>

          {/* Text to Speech Widget */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl flex flex-col h-[350px]">
            <textarea
              className="w-full bg-transparent text-gray-300 resize-none outline-none flex-1 mb-4 placeholder-gray-600"
              placeholder="Type the messages here..."
              value={ttsMessage}
              onChange={(e) => setTtsMessage(e.target.value)}
            ></textarea>
            
            <div className="flex flex-col items-center gap-3 mt-auto">
              <span className="text-xs text-gray-500">With AI Text to Speech</span>
              <button 
                className="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors"
                onClick={() => alert(`Broadcasting: ${ttsMessage}`)}
              >
                Announce Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
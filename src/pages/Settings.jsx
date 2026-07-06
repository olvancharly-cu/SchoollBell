import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings({ schedules, setSchedules, activeDay, setActiveDay }) {
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Bel');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Exam Week'];
  const currentDaySchedules = schedules[activeDay] || [];

  const handleAddSchedule = (e) => {
    e.preventDefault(); 
    const formattedTime = newTime.replace(':', '.');
    const newSchedule = { id: Date.now(), time: formattedTime, type: newType, title: newTitle };
    
    // Nambahin jadwal HANYA ke hari yang sedang aktif
    setSchedules({
      ...schedules,
      [activeDay]: [...currentDaySchedules, newSchedule]
    });
    
    setNewTime('');
    setNewTitle('');
  };

  const handleDelete = (id) => {
    // Menghapus jadwal HANYA di hari yang sedang aktif
    setSchedules({
      ...schedules,
      [activeDay]: currentDaySchedules.filter(schedule => schedule.id !== id)
    });
  };

  // Urutkan jadwal yang tampil di daftar settings berdasarkan waktu
  const sortedSchedules = [...currentDaySchedules].sort((a, b) => {
    const timeA = a.time.split('.').map(Number);
    const timeB = b.time.split('.').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">⚙️ Settings Jadwal</h1>
          <Link to="/" className="bg-[#3f3f46] hover:bg-gray-600 px-5 py-2 rounded-lg font-semibold transition shadow-md">
            🔙 Kembali ke Dashboard
          </Link>
        </div>

        {/* --- PILIH HARI YANG MAU DIEDIT --- */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                activeDay === day ? 'bg-blue-600 text-white shadow-md' : 'bg-[#1a1a1c] text-gray-400 hover:bg-[#27272a] border border-gray-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a1c] p-6 rounded-xl shadow-lg mb-8 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Tambah Jadwal: {activeDay}</h2>
          <form onSubmit={handleAddSchedule} className="flex gap-4 items-end">
            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-sm text-gray-400">Jam</label>
              <input type="time" required value={newTime} onChange={(e) => setNewTime(e.target.value)} className="bg-[#0f0f11] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" style={{ colorScheme: 'dark' }} />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-sm text-gray-400">Tipe Suara</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className="bg-[#0f0f11] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                <option value="Bel">Bel</option>
                <option value="Music">Music</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-2/4">
              <label className="text-sm text-gray-400">Judul (misal: Break)</label>
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-[#0f0f11] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Judul Jadwal" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg transition h-[50px] shadow-md">
              Tambah
            </button>
          </form>
        </div>

        <div className="bg-[#1a1a1c] p-6 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Daftar Jadwal Aktif: {activeDay}</h2>
          <div className="flex flex-col gap-3">
            {sortedSchedules.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-[#0f0f11] p-4 rounded-lg border border-gray-800 shadow-sm">
                <div className="flex gap-6 items-center">
                  <span className="text-2xl font-bold w-20">{item.time}</span>
                  <span className="text-gray-400 text-sm w-16">{item.type}</span>
                  <span className="text-lg font-semibold">{item.title}</span>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 font-semibold px-4 py-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition">
                  Hapus
                </button>
              </div>
            ))}
            {sortedSchedules.length === 0 && <p className="text-gray-500 text-center py-4">Belum ada jadwal untuk {activeDay}.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
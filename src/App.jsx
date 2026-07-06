import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  // 1. Deteksi hari ini secara real-time saat web dibuka
  const todayReal = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // 2. Jadikan hari ini sebagai tab default yang terbuka (bukan Monday lagi!)
  const [activeDay, setActiveDay] = useState(todayReal);

  const [schedules, setSchedules] = useState({
    Monday: [
      { id: 1, time: '07.00', type: 'Music', title: 'Indonesia Raya' },
      { id: 2, time: '07.05', type: 'Bel', title: 'Start 1st Class' },
    ],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    'Exam Week': []
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard schedules={schedules} activeDay={activeDay} setActiveDay={setActiveDay} />} />
        <Route path="/settings" element={<Settings schedules={schedules} setSchedules={setSchedules} activeDay={activeDay} setActiveDay={setActiveDay} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
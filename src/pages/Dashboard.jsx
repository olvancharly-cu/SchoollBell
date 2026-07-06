import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard({ schedules, activeDay, setActiveDay }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(false);

  // Pakai useRef untuk menyambungkan ke tag <audio> di HTML bawah
  const sirenRef = useRef(null);
  const belRef = useRef(null);
  const musicRef = useRef(null);
  const lastPlayedTime = useRef('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 1. BIKIN FORMAT JAM ANTI GAGAL ---
  // Kita ambil angka jam dan menitnya secara manual, lalu gabungkan pakai titik "."
  // Ini jaminan 100% cocok sama data jadwal yang lo ketik di Settings!
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const exactTime = `${hours}.${minutes}`; 

  const formattedDate = currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todayReal = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const isToday = activeDay === todayReal;
  
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split('.').map(Number);
    return h * 60 + m;
  };
  
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Filter Jadwal UI
  const currentDaySchedules = schedules[activeDay] || [];
  const upcomingSchedules = [...currentDaySchedules]
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
    .filter((schedule) => {
      if (isToday) return timeToMinutes(schedule.time) >= currentMinutes;
      return true;
    });

  const nextBel = upcomingSchedules.length > 0 ? upcomingSchedules[0] : null;
  const onQueue = upcomingSchedules.length > 1 ? upcomingSchedules.slice(1) : [];

  // --- 2. HACK UNLOCKER (DENGAN TEST SUARA) ---
  const handleStartSystem = () => {
    if (belRef.current) {
      belRef.current.volume = 0.3; // Volume kecil buat tes
      belRef.current.play().catch(e => console.log("Gagal test:", e));
      
      // Matikan suara test setelah 1 detik
      setTimeout(() => {
        if (belRef.current) {
          belRef.current.pause();
          belRef.current.currentTime = 0;
          belRef.current.volume = 1; // Balikin full volume buat alarm asli
        }
      }, 1000); 
    }
    
    // Pancing audio musik juga biar unlock
    if (musicRef.current) {
      musicRef.current.volume = 0; 
      musicRef.current.play().then(() => {
        musicRef.current.pause();
        musicRef.current.volume = 1;
      }).catch(()=> {});
    }

    setIsSystemReady(true);
  };

  // --- 3. ALARM BACKGROUND ---
  useEffect(() => {
    if (!isSystemReady) return; 

    const realTodaySchedules = schedules[todayReal] || [];
    const upcomingReal = [...realTodaySchedules]
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      .filter((sch) => timeToMinutes(sch.time) >= currentMinutes);
      
    const realNextBel = upcomingReal.length > 0 ? upcomingReal[0] : null;

    // Pakai exactTime untuk perbandingan yang akurat
    if (realNextBel && exactTime === realNextBel.time) {
      if (lastPlayedTime.current !== realNextBel.time) {
        
        const audioToPlay = realNextBel.type === 'Music' ? musicRef.current : belRef.current;
        if (audioToPlay) {
          audioToPlay.currentTime = 0;
          audioToPlay.play().catch(e => console.error("Alarm diblokir browser:", e));
        }
        
        lastPlayedTime.current = realNextBel.time;
      }
    }
  }, [exactTime, schedules, todayReal, currentMinutes, isSystemReady]);

  // SOS & TTS Function
  const handleSOSClick = () => {
    if (!sirenRef.current) return;
    if (isSOSActive) {
      sirenRef.current.pause();
      sirenRef.current.currentTime = 0;
      setIsSOSActive(false);
    } else {
      sirenRef.current.play();
      setIsSOSActive(true);
    }
  };

  const handleAnnounce = () => {
    if (!announceText.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announceText);
      utterance.lang = 'id-ID'; 
      utterance.rate = 0.9; 
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser tidak support Text-to-Speech.");
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Exam Week'];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-8 font-sans flex justify-center">
      
      {/* 4. INI RAHASIANYA: TAG AUDIO FISIK DISIMPAN DI DALAM HTML */}
      <audio ref={sirenRef} src="https://actions.google.com/sounds/v1/emergency/emergency_siren_close_long.ogg" loop />
      <audio ref={belRef} src="https://actions.google.com/sounds/v1/alarms/school_bell_ringing.ogg" />
      <audio ref={musicRef} src="https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg" />

      <div className="w-full max-w-7xl flex gap-8">
        
        {/* KOLOM KIRI */}
        <div className="w-1/6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2 tracking-wide">SchoolBell</h1>
          
          {!isSystemReady ? (
            <button 
              onClick={handleStartSystem} 
              className="w-full py-3 mb-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] animate-pulse"
            >
              🟢 KLIK AKTIFKAN BEL
            </button>
          ) : (
            <div className="w-full py-2 mb-2 bg-green-900/30 rounded-lg text-sm text-green-400 font-bold text-center border border-green-800 shadow-md">
              ✅ Auto-Bel Aktif
            </div>
          )}

          <div className="flex flex-col gap-3">
            {days.map((day) => (
              <button 
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-full py-2 rounded-lg text-sm transition shadow-md ${
                  activeDay === day ? 'bg-[#3f3f46] text-gray-200' : 'bg-[#27272a] hover:bg-[#3f3f46] text-gray-400'
                }`}
              >
                {day}
              </button>
            ))}
            <Link to="/settings" className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-center rounded-lg text-sm font-bold text-white transition shadow-md">
              ⚙️ Settings Jadwal
            </Link>
          </div>
        </div>

        {/* KOLOM TENGAH */}
        <div className="w-5/12 flex flex-col gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-3">Next Bel ({activeDay})</p>
            {nextBel ? (
              <div className={`p-6 rounded-xl flex items-center shadow-lg border transition-all duration-500 ${
                isToday && exactTime === nextBel.time ? 'bg-green-900 border-green-500 animate-pulse' : 'bg-[#1a1a1c] border-gray-800'
              }`}>
                <h2 className="text-4xl font-bold w-32">{nextBel.time}</h2>
                <span className="text-gray-400 w-20">{nextBel.type}</span>
                <h3 className="text-2xl font-bold">{nextBel.title}</h3>
              </div>
            ) : (
              <div className="bg-[#1a1a1c] p-6 rounded-xl text-gray-500 shadow-lg text-center border border-gray-800">
                Tidak ada jadwal / sudah selesai.
              </div>
            )}
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">On Queue</p>
            <div className="flex flex-col gap-4">
              {onQueue.map((item) => (
                <div key={item.id} className="bg-[#1a1a1c] p-6 rounded-xl flex items-center shadow-lg border border-gray-800">
                  <h2 className="text-3xl font-bold w-32">{item.time}</h2>
                  <span className="text-gray-400 w-20 text-sm">{item.type}</span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
              ))}
              {onQueue.length === 0 && <p className="text-gray-600 text-sm text-center mt-4">Antrean kosong.</p>}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="w-5/12 flex flex-col gap-6">
          <div className="bg-[#1a1a1c] p-8 rounded-xl flex flex-col items-center justify-center shadow-lg border border-gray-800">
            <p className="text-gray-400 text-sm">{formattedDate}</p>
            <h1 className="text-7xl font-bold my-2 tracking-tighter">{exactTime}</h1>
            <p className="text-gray-400 text-xs">Local Time <span className="text-white font-semibold">Jakarta, Indonesia</span></p>
          </div>
          
          <div className={`p-6 rounded-xl flex items-center justify-between shadow-lg border transition-all duration-300 ${
            isSOSActive ? 'bg-red-950 border-red-500' : 'bg-[#1a1a1c] border-gray-800'
          }`}>
            <div>
              <p className={isSOSActive ? 'text-red-300 text-sm' : 'text-gray-400 text-sm'}>{isSOSActive ? 'Siren is Active!' : 'Click to Activate the Siren'}</p>
              <p className="text-white font-bold text-xs mt-1">ONLY FOR EMERGENCY USE</p>
            </div>
            <button onClick={handleSOSClick} className={`font-bold py-3 px-8 rounded-xl transition shadow-md ${isSOSActive ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' : 'bg-[#d33a3a] hover:bg-red-700 text-white'}`}>
              {isSOSActive ? 'STOP' : 'SOS'}
            </button>
          </div>

          <div className="bg-[#1a1a1c] p-6 rounded-xl flex flex-col flex-grow shadow-lg border border-gray-800">
            <textarea value={announceText} onChange={(e) => setAnnounceText(e.target.value)} className="bg-transparent w-full resize-none outline-none text-gray-300 placeholder-gray-500 h-40" placeholder="Ketik pengumuman di sini..."></textarea>
            <div className="mt-auto text-center flex flex-col items-center gap-2">
              <p className="text-gray-500 text-xs">With AI Text to Speech</p>
              <button onClick={handleAnnounce} disabled={isSpeaking} className={`font-bold py-3 w-full rounded-xl transition shadow-md ${isSpeaking ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-[#6b108f] hover:bg-[#8614b3] text-white'}`}>
                {isSpeaking ? '📢 Sedang Mengumumkan...' : 'Announce Now'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
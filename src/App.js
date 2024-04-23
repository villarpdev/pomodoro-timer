import logo from './logo.svg';
import './App.css';
import Timer from './components/Timer';
import Settings from './components/Settings';
import SettingsContext from './components/SettingsContext';

import  { useState, useEffect } from 'react';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(30);
  const [breakMinutes, setBreakMinutes] = useState(5);

  return (
    <main>
      <SettingsContext.Provider value={{
        showSettings,
        workMinutes,
        breakMinutes,
        setShowSettings,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;

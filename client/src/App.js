import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white transition-colors duration-500">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <HeroSection />
      </div>
    </div>
  );
}

export default App;

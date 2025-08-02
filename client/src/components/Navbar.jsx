import React from 'react';

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="bg-gradient-to-r from-green-700 to-gray-800 text-white shadow-lg w-full py-5 relative">
      <div className="max-w-10xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo1.jpg"
            alt="Logo"
            className="h-20 w-20 rounded-full border-2 border-black shadow-md"
          />
        </div>

        {/* Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-14 text-3xl font-bold">
          <a href="#home" className="hover:text-green-300 hover:underline transition">Home</a>
          <a href="#about" className="hover:text-green-300 hover:underline transition">About</a>
          <a href="#contact" className="hover:text-green-300 hover:underline transition">Contact</a>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm px-4 py-4 rounded-md bg-white text-green-800 hover:bg-blue-200 transition font-bold ml-4"
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import logo from '../logoipsum-221.svg'

function Header() {
  return (
    <header className="bg-purple-600 p-4 mb-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-2xl font-bold mb-4 md:mb-0"> <img src={logo} alt='logo'/></div>
        <nav className="space-x-4">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">About</a>
          <a href="#" className="text-white">Services</a>
          <a href="#" className="text-white">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
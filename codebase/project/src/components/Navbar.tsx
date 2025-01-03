import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import CartButton from './CartButton';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">eNkoko</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/elearning" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-secondary-300">
              Ihugure
            </Link>
            <Link to="/marketplace" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-secondary-300">
              Isoko
            </Link>
            <Link to="/hatchery" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-secondary-300">
              Imishwi
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-secondary-300">
              Twandikire
            </Link>
            <CartButton />
            <AuthButton />
          </div>

          <div className="sm:hidden flex items-center">
            <CartButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary-300 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-primary-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/elearning"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300"
            >
              Ihugure
            </Link>
            <Link
              to="/marketplace"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300"
            >
              Isoko
            </Link>
            <Link
              to="/hatchery"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300"
            >
              Imishwi
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300"
            >
              Twandikire
            </Link>
            <div className="px-3 py-2">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
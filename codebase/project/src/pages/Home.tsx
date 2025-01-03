import React from 'react';
import { BookOpen, ShoppingBag, Egg } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Igisubizo Cyuzuye cyo Korora Inkoko
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Iga, Gura, kandi Kura na eNkoko
              </p>
              <Link
                to="/marketplace"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Tangira
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Serivisi Zacu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Kwiga kuri interineti</h3>
              <p className="text-gray-600 mb-6">
                Bona inyigisho zirambuye ku bijyanye no korora inkoko
              </p>
              <Link
                to="/elearning"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Tangira Kwiga →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Isoko</h3>
              <p className="text-gray-600 mb-6">
                Gura ibikoresho by'inkoko by'umwimerere, imiti, n'ibikomoka ku nkoko
              </p>
              <Link
                to="/marketplace"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Tangira Kugura →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Egg className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Imishwi</h3>
              <p className="text-gray-600 mb-6">
                Tumiza imishwi y'umwimerere mu ituragiro ryacu ryemewe
              </p>
              <Link
                to="/hatchery"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Tumiza Nonaha →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
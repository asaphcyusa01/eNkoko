import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, ShoppingBag, Egg, Users, ChartBar, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Abanyeshuri Bose', value: '234', change: '+12%', trend: 'up' },
    { label: 'Amasomo Yose', value: '12', change: '+2', trend: 'up' },
    { label: 'Ibicuruzwa', value: '45', change: '+5', trend: 'up' },
    { label: 'Imishwi Yagurishijwe', value: '1,234', change: '+22%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ikaze mu Buyobozi</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300">
              Raporo
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Ubufasha
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-gray-600 text-sm mb-2">{stat.label}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/admin/courses" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Amasomo</h2>
                <p className="text-gray-600">Gucunga amasomo n'inyigisho</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/orders" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Commandes</h2>
                <p className="text-gray-600">Gucunga commandes zose</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/products" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Ibicuruzwa</h2>
                <p className="text-gray-600">Gucunga ibicuruzwa mu isoko</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/breeds" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-lg">
                <Egg className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Imishwi</h2>
                <p className="text-gray-600">Gucunga imishwi n'ubwoko bwayo</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Ibikorwa Biheruka</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Umunyeshuri mushya yiyandikishije</p>
                    <p className="text-sm text-gray-600">Ejo - 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Igicuruzwa gishya cyongewemo</p>
                    <p className="text-sm text-gray-600">Ejo - 12:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ChartBar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Raporo y'ukwezi yatanzwe</p>
                    <p className="text-sm text-gray-600">Ejo - 09:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, ShoppingBag, Egg, Settings } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/admin/courses" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Courses</h2>
                <p className="text-gray-600">Manage e-learning content</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Products</h2>
                <p className="text-gray-600">Manage marketplace items</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/breeds" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Egg className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Breeds</h2>
                <p className="text-gray-600">Manage hatchery breeds</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
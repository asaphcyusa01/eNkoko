import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Egg, Users, ChartBar, ClipboardList, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalProducts: number;
  totalChicks: number;
  recentOrders: {
    type: string;
    description: string;
    time: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalProducts: 0,
    totalChicks: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      setLoading(true);
      setError(null);

      // First verify admin access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        throw new Error('Unauthorized access');
      }

      // Get total students (unique users with progress)
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id', { count: 'exact', head: true });

      if (progressError) throw progressError;

      // Get total courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true });

      if (coursesError) throw coursesError;

      // Get total products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Get total chicks sold
      const { data: chicksData, error: chicksError } = await supabase
        .from('order_items')
        .select('quantity')
        .eq('category', 'chick');

      if (chicksError) throw chicksError;

      const totalChicks = chicksData?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      // Get recent orders
      const { data: recentOrdersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (ordersError) throw ordersError;

      const recentOrders = recentOrdersData?.map(order => ({
        type: order.category === 'marketplace' ? 'product' : 'chick',
        description: `Commande nshya ya ${order.category === 'marketplace' ? 'ibicuruzwa' : 'imishwi'}`,
        time: new Date(order.created_at).toLocaleString('rw-RW', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      })) || [];

      setStats({
        totalStudents: progressData?.length || 0,
        totalCourses: coursesData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalChicks: totalChicks,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Hari ikibazo cyavutse. Gerageza nanone.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Tegereza gato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Gerageza nanone
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Abanyeshuri Bose', value: stats.totalStudents, icon: Users },
    { label: 'Amasomo Yose', value: stats.totalCourses, icon: BookOpen },
    { label: 'Ibicuruzwa', value: stats.totalProducts, icon: ShoppingBag },
    { label: 'Imishwi Yagurishijwe', value: stats.totalChicks, icon: Egg }
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
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
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
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((activity, index) => {
                    const Icon = activity.type === 'product' ? ShoppingBag : Egg;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-center py-4">Nta bikorwa biheruka</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useOrders } from '../../hooks/useOrders';

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { orders, loading, error, updateOrderStatus } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

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
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Hari ikibazo cyavutse. Gerageza nanone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gucunga Commandes</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Shakisha izina cyangwa numero ya commande..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Uko Bigeze Byose</option>
              <option value="pending">Bitegerejwe</option>
              <option value="confirmed">Byemejwe</option>
              <option value="cancelled">Byahagaritswe</option>
              <option value="delivered">Byagejejwe</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Ubwoko Bwose</option>
              <option value="marketplace">Isoko</option>
              <option value="hatchery">Imishwi</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Numero</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Umukiriya</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Itariki</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Igiciro</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Ubwoko</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Uko Bigeze</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Ibikorwa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.order_date).toLocaleDateString('rw-RW')}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {order.category === 'marketplace' ? 'Isoko' : 'Imishwi'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status === 'pending' && 'Bitegerejwe'}
                        {order.status === 'confirmed' && 'Byemejwe'}
                        {order.status === 'cancelled' && 'Byahagaritswe'}
                        {order.status === 'delivered' && 'Byagejejwe'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Commande #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Amakuru y'Umukiriya</h3>
                  <p>{selectedOrder.customer_name}</p>
                  <p>{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Amakuru ya Commande</h3>
                  <p>Itariki: {new Date(selectedOrder.order_date).toLocaleDateString('rw-RW')}</p>
                  <p>Ubwoko: {selectedOrder.category === 'marketplace' ? 'Isoko' : 'Imishwi'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Ibicuruzwa</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Izina</th>
                        <th className="px-4 py-2 text-right">Ingano</th>
                        <th className="px-4 py-2 text-right">Igiciro</th>
                        <th className="px-4 py-2 text-right">Igiteranyo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 font-semibold text-right">Igiteranyo Rusange</td>
                        <td className="px-4 py-2 font-semibold text-right">{formatCurrency(selectedOrder.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Funga
                </button>
                {selectedOrder.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Hagarika
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Emeza
                    </button>
                  </>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Garagaza ko Byagejejwe
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
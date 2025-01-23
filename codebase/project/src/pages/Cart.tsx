import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

export default function Cart() {
  const { state, dispatch, checkout } = useCart();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await checkout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Igitebo Kirimo Ubusa</h1>
            <p className="text-gray-600 mb-8">Reba ibicuruzwa byacu maze uhitemo ibyo ukeneye.</p>
            <Link
              to="/marketplace"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-300"
            >
              Komeza Kugura
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Igitebo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {state.items.map((item) => (
                <div key={item.id} className="p-6 border-b last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Incamake y'Igiciro</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Igiciro</span>
                <span>{formatCurrency(state.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gutwara</span>
                <span>Ubuntu</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Igiciro cyose</span>
                  <span>{formatCurrency(state.total)}</span>
                </div>
              </div>
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full bg-orange-600 text-white py-3 rounded-lg transition duration-300 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'
                }`}
              >
                {isProcessing ? 'Tegereza gato...' : 'Ishyura'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Calendar, Truck, Check, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ChickBreed } from '../types';
import { formatCurrency } from '../utils/currency';

const breeds: ChickBreed[] = [
  {
    id: '1',
    name: 'Rhode Island Red',
    description: 'Inkoko zitanga amagi menshi kandi zifite imico myiza',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    availability: true
  },
  {
    id: '2',
    name: 'Plymouth Rock',
    description: 'Inkoko zitanga amagi n\'inyama',
    price: 2250,
    image: 'https://images.unsplash.com/photo-1563254938-89e51f9c2f64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    availability: true
  },
  {
    id: '3',
    name: 'Leghorn',
    description: 'Inkoko zitanga amagi yera menshi',
    price: 1900,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    availability: false
  }
];

const deliveryTimes = {
  'Rhode Island Red': 14,
  'Plymouth Rock': 21,
  'Leghorn': 14
};

export default function Hatchery() {
  const { dispatch } = useCart();
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  const handleAddToCart = (breed: ChickBreed) => {
    if (!breed.availability) return;
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: {
        id: breed.id,
        name: breed.name,
        description: breed.description,
        price: breed.price,
        image: breed.image,
        category: 'Imishwi'
      }
    });
  };

  return (
    <div className="min-h-screen bg-primary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Imishwi</h1>
          <p className="text-xl text-gray-600">Gura imishwi y'umwimerere mu rubyaro rwacu rwemewe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {breeds.map((breed) => (
            <div key={breed.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={breed.image}
                alt={breed.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{breed.name}</h3>
                <p className="text-gray-600 mb-4">{breed.description}</p>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>Iminsi yo gutegereza: {deliveryTimes[breed.name as keyof typeof deliveryTimes]}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-700">{formatCurrency(breed.price)}/umushwi</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    breed.availability
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {breed.availability ? 'Irahari' : 'Ntiboneka'}
                  </span>
                </div>
                <div className="space-y-4">
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date(Date.now() + deliveryTimes[breed.name as keyof typeof deliveryTimes] * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <button
                    onClick={() => handleAddToCart(breed)}
                    className={`w-full px-4 py-2 rounded-lg text-white ${
                      breed.availability
                        ? 'bg-secondary-600 hover:bg-secondary-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    } transition duration-300`}
                    disabled={!breed.availability || !selectedDate}
                  >
                    {breed.availability ? 'Shyira mu gitebo' : 'Ntiboneka'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Uko Bigenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Gutumiza</h3>
              <p className="text-gray-600">Hitamo itariki yo kuzana</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Kugenzura Ubuziranenge</h3>
              <p className="text-gray-600">Imishwi yose ifite icyemezo cy'ubuzima</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Kugeza ku Mukiriya</h3>
              <p className="text-gray-600">Gutwara mu modoka ifite ubushyuhe bwiza</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
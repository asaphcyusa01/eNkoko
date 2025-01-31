import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ChickBreed } from '../../types';
import { formatCurrency } from '../../utils/currency';
import ImageUpload from '../../components/ImageUpload';

export default function Breeds() {
  const [breeds, setBreeds] = useState<ChickBreed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBreed, setEditingBreed] = useState<ChickBreed | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    availability: true
  });

  React.useEffect(() => {
    fetchBreeds();
  }, []);

  async function fetchBreeds() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBreeds(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const breedData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingBreed) {
        const { error } = await supabase
          .from('breeds')
          .update(breedData)
          .eq('id', editingBreed.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('breeds')
          .insert(breedData);

        if (error) throw error;
      }

      setShowAddModal(false);
      setEditingBreed(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        availability: true
      });
      fetchBreeds();
    } catch (error) {
      console.error('Error saving breed:', error);
    }
  };

  const handleEdit = (breed: ChickBreed) => {
    setEditingBreed(breed);
    setFormData({
      name: breed.name,
      description: breed.description,
      price: breed.price.toString(),
      image: breed.image,
      availability: breed.availability
    });
    setShowAddModal(true);
  };

  const handleDelete = async (breedId: string) => {
    if (window.confirm('Uremeza ko ushaka gusiba ubu bwoko?')) {
      try {
        const { error } = await supabase
          .from('breeds')
          .delete()
          .eq('id', breedId);

        if (error) throw error;
        fetchBreeds();
      } catch (error) {
        console.error('Error deleting breed:', error);
      }
    }
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    breed.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Gucunga Ubwoko bw'Imishwi</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            <Plus className="h-5 w-5" />
            Ubwoko Bushya
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Shakisha ubwoko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Breeds List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Ubwoko</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Igiciro</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Uko Bihagaze</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Ibikorwa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBreeds.map((breed) => (
                  <tr key={breed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={breed.image}
                          alt={breed.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{breed.name}</p>
                          <p className="text-sm text-gray-600">{breed.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(breed.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        breed.availability
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {breed.availability ? 'Irahari' : 'Ntiboneka'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(breed)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(breed.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
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

      {/* Add/Edit Breed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBreed ? 'Hindura Ubwoko' : 'Ubwoko Bushya'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBreed(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    image: '',
                    availability: true
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Izina ry'Ubwoko
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ibisobanuro
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Igiciro
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="100"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uko Bihagaze
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={formData.availability}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span>Birahari</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ifoto
                </label>
                <ImageUpload
                  bucket="breed-images"
                  onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  currentImage={formData.image}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBreed(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      availability: true
                    });
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Reka
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingBreed ? 'Hindura' : 'Ongeramo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Play, FileText, Download } from 'lucide-react';
import { Course } from '../types';
import { Link } from 'react-router-dom';

const courses: Course[] = [
  {
    id: '1',
    title: 'Gukumira Indwara z\'Inkoko',
    description: 'Menya uko wakumira no kuvura indwara z\'inkoko.',
    category: 'Ubuzima',
    thumbnail: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 'Amasaha 2'
  },
  {
    id: '2',
    title: 'Gutunganya Ibiryo by\'Inkoko',
    description: 'Menya uko watunganya ibiryo by\'inkoko neza.',
    category: 'Ibiryo',
    thumbnail: 'https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 'Isaha n\'igice'
  },
  {
    id: '3',
    title: 'Kubaka Ikiraro cy\'Inkoko',
    description: 'Iga uko wakubaka ikiraro cy\'inkoko kiza.',
    category: 'Ikiraro',
    thumbnail: 'https://images.unsplash.com/photo-1563254938-89e51f9c2f64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 'Amasaha 3'
  }
];

export default function ELearning() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ihugure</h1>
          <p className="text-xl text-gray-600">Iga byinshi ku bijyanye no korora inkoko</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link to={`/course/${course.id}`} key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full mb-4">
                  {course.category}
                </span>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-500">
                    <Play className="h-5 w-5 mr-1" />
                    {course.duration}
                  </span>
                  <span className="text-orange-600 font-semibold">Tangira Kwiga →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Ibindi Bikoresho</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-6 bg-white rounded-lg shadow-lg">
              <FileText className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold mb-1">Amabwiriza yo Korora</h3>
                <p className="text-gray-600">Igitabo kijyanye no korora inkoko</p>
              </div>
              <button className="ml-auto text-orange-600 hover:text-orange-700">
                <Download className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center p-6 bg-white rounded-lg shadow-lg">
              <FileText className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold mb-1">Ubuzima bw\'Inkoko</h3>
                <p className="text-gray-600">Igitabo cy\'indwara n\'ubuvuzi</p>
              </div>
              <button className="ml-auto text-orange-600 hover:text-orange-700">
                <Download className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}